/**
 * Real-Time Messaging Frontend Integration
 * Handles chat UI and Socket.io integration
 */

let currentConversationId = null;
let currentReceiverId = null;
let typingTimeout = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof api === 'undefined') {
    console.error('API helper not loaded');
    return;
  }

  // Initialize Socket.io connection
  await initializeSocket();

  // Load conversations list
  await loadConversations();

  // Check if we have a specific conversation or user to open
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const conversationId = urlParams.get('conversationId');

  if (conversationId) {
    await openConversation(conversationId);
  } else if (userId) {
    await startConversation(userId);
  }
});

/**
 * Initialize Socket.io connection
 */
const initializeSocket = async () => {
  if (typeof socketClient === 'undefined') {
    console.error('Socket client not loaded. Please include socketClient.js');
    return;
  }

  const token = api.getAuthToken();
  if (!token) {
    console.error('No auth token found. Please login.');
    return;
  }

  // Connect socket
  socketClient.connect(token);

  // Setup event listeners
  socketClient.on('new_message', handleNewMessage);
  socketClient.on('message_sent', handleMessageSent);
  socketClient.on('message_read_receipt', handleReadReceipt);
  socketClient.on('user_typing', handleUserTyping);
  socketClient.on('user_stopped_typing', handleUserStoppedTyping);
  socketClient.on('user_online', handleUserOnline);
  socketClient.on('user_offline', handleUserOffline);
  socketClient.on('error', handleSocketError);
};

/**
 * Load conversations list
 */
const loadConversations = async () => {
  const conversationsList = document.getElementById('conversations-list');
  if (!conversationsList) return;

  try {
    conversationsList.innerHTML = '<div class="text-center py-4">Loading conversations...</div>';

    const response = await api.messages.getConversations();

    if (response.success && response.data && response.data.conversations) {
      const conversations = response.data.conversations;

      if (conversations.length > 0) {
        conversationsList.innerHTML = conversations
          .map(conv => createConversationItem(conv))
          .join('');
      } else {
        conversationsList.innerHTML = '<div class="text-center py-4 text-gray-500">No conversations yet.</div>';
      }
    } else {
      throw new Error('Failed to load conversations');
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
    conversationsList.innerHTML = '<div class="text-center py-4 text-red-500">Failed to load conversations.</div>';
  }
};

/**
 * Create conversation list item
 * @param {Object} conversation - Conversation object
 * @returns {string} - HTML string
 */
const createConversationItem = (conversation) => {
  const otherParticipant = conversation.otherParticipant || {};
  const lastMessage = conversation.lastMessage || {};
  const unreadCount = conversation.unreadCount || 0;

  return `
    <div class="conversation-item" data-conversation-id="${conversation._id}" onclick="openConversation('${conversation._id}')">
      <div class="conversation-avatar">
        <img src="../images/avatar-1.png" alt="${otherParticipant.fullName || 'User'}" />
        ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
      </div>
      <div class="conversation-info">
        <h4>${otherParticipant.fullName || 'Unknown'}</h4>
        <p class="last-message">${lastMessage.content || 'No messages yet'}</p>
      </div>
      <div class="conversation-meta">
        <span class="time">${formatTime(lastMessage.createdAt)}</span>
      </div>
    </div>
  `;
};

/**
 * Open conversation
 * @param {string} conversationId - Conversation ID
 */
const openConversation = async (conversationId) => {
  currentConversationId = conversationId;
  const messagesContainer = document.getElementById('messages-container');
  if (!messagesContainer) return;

  try {
    messagesContainer.innerHTML = '<div class="text-center py-10">Loading messages...</div>';

    const response = await api.messages.getMessages(conversationId);

    if (response.success && response.data && response.data.messages) {
      const messages = response.data.messages;
      messagesContainer.innerHTML = messages.map(msg => createMessageBubble(msg)).join('');

      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Mark messages as read
      const unreadMessages = messages.filter(msg => !msg.isRead && msg.receiver._id === getCurrentUserId());
      unreadMessages.forEach(msg => {
        socketClient.markMessageAsRead(msg._id);
      });
    } else {
      throw new Error('Failed to load messages');
    }
  } catch (error) {
    console.error('Error loading messages:', error);
    messagesContainer.innerHTML = '<div class="text-center py-10 text-red-500">Failed to load messages.</div>';
  }
};

/**
 * Start conversation with a user
 * @param {string} userId - User ID
 */
const startConversation = async (userId) => {
  currentReceiverId = userId;
  // Find existing conversation or create new one
  try {
    const response = await api.messages.getConversations();
    if (response.success && response.data && response.data.conversations) {
      const conversation = response.data.conversations.find(
        conv => conv.otherParticipant && conv.otherParticipant._id === userId
      );
      if (conversation) {
        await openConversation(conversation._id);
      } else {
        // New conversation - just show empty chat
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
          messagesContainer.innerHTML = '<div class="text-center py-10 text-gray-500">Start a conversation...</div>';
        }
      }
    }
  } catch (error) {
    console.error('Error starting conversation:', error);
  }
};

/**
 * Create message bubble HTML
 * @param {Object} message - Message object
 * @returns {string} - HTML string
 */
const createMessageBubble = (message) => {
  const isMine = message.sender._id === getCurrentUserId();
  const senderName = message.sender.fullName || 'Unknown';
  const time = formatTime(message.createdAt);

  return `
    <div class="message-bubble ${isMine ? 'message-mine' : 'message-theirs'}">
      ${!isMine ? `<div class="message-sender">${senderName}</div>` : ''}
      <div class="message-content">${escapeHtml(message.content)}</div>
      <div class="message-time">
        ${time}
        ${isMine && message.isRead ? '<span class="read-indicator">✓✓</span>' : ''}
        ${isMine && !message.isRead ? '<span class="read-indicator">✓</span>' : ''}
      </div>
    </div>
  `;
};

/**
 * Send message
 */
const sendMessage = async () => {
  const messageInput = document.getElementById('message-input');
  if (!messageInput) return;

  const content = messageInput.value.trim();
  if (!content) return;

  if (!currentReceiverId && !currentConversationId) {
    if (typeof toast !== 'undefined') {
      toast.error('Please select a conversation first');
    }
    return;
  }

  try {
    // If we have conversationId, get receiver from it
    let receiverId = currentReceiverId;
    if (!receiverId && currentConversationId) {
      const response = await api.messages.getConversations();
      if (response.success && response.data && response.data.conversations) {
        const conv = response.data.conversations.find(c => c._id === currentConversationId);
        if (conv && conv.otherParticipant) {
          receiverId = conv.otherParticipant._id;
        }
      }
    }

    if (!receiverId) {
      throw new Error('Receiver not found');
    }

    // Send via Socket.io if connected, otherwise use REST
    if (socketClient && socketClient.getConnectionStatus()) {
      socketClient.sendMessage(receiverId, content);
    } else {
      await api.messages.sendMessage(receiverId, content);
    }

    // Clear input
    messageInput.value = '';

    // Stop typing indicator
    if (socketClient) {
      socketClient.stopTyping(receiverId);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to send message');
    }
  }
};

/**
 * Handle new message from socket
 * @param {Object} data - Message data
 */
const handleNewMessage = (data) => {
  const messagesContainer = document.getElementById('messages-container');
  if (!messagesContainer) return;

  const message = data.message;
  if (message.conversation === currentConversationId || message.sender._id === currentReceiverId) {
    // Add message to UI
    const messageHtml = createMessageBubble(message);
    messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Mark as read
    if (socketClient) {
      socketClient.markMessageAsRead(message._id);
    }

    // Update conversations list
    loadConversations();
  }
};

/**
 * Handle message sent confirmation
 * @param {Object} data - Message data
 */
const handleMessageSent = (data) => {
  const messagesContainer = document.getElementById('messages-container');
  if (!messagesContainer) return;

  const message = data.message;
  if (message.conversation === currentConversationId) {
    const messageHtml = createMessageBubble(message);
    messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

/**
 * Handle typing indicator
 * @param {Object} data - Typing data
 */
const handleUserTyping = (data) => {
  // Show typing indicator
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.textContent = `${data.fullName} is typing...`;
    typingIndicator.style.display = 'block';
  }
};

/**
 * Handle typing stopped
 * @param {Object} data - Typing data
 */
const handleUserStoppedTyping = (data) => {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.style.display = 'none';
  }
};

/**
 * Handle read receipt
 * @param {Object} data - Read receipt data
 */
const handleReadReceipt = (data) => {
  // Update message read status in UI
  const messageElement = document.querySelector(`[data-message-id="${data.messageId}"]`);
  if (messageElement) {
    const readIndicator = messageElement.querySelector('.read-indicator');
    if (readIndicator) {
      readIndicator.textContent = '✓✓';
    }
  }
};

/**
 * Handle user online
 * @param {Object} data - User data
 */
const handleUserOnline = (data) => {
  // Update online status in UI
  console.log('User online:', data);
};

/**
 * Handle user offline
 * @param {Object} data - User data
 */
const handleUserOffline = (data) => {
  // Update offline status in UI
  console.log('User offline:', data);
};

/**
 * Handle socket error
 * @param {Object} error - Error object
 */
const handleSocketError = (error) => {
  console.error('Socket error:', error);
  if (typeof toast !== 'undefined') {
    toast.error(error.message || 'Connection error');
  }
};

/**
 * Handle typing input
 */
const handleTyping = () => {
  if (!currentReceiverId && !currentConversationId) return;

  // Get receiver ID
  let receiverId = currentReceiverId;
  if (!receiverId && currentConversationId) {
    // Get from conversation
    // This is simplified - you might want to cache this
  }

  if (receiverId && socketClient) {
    socketClient.startTyping(receiverId);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeout = setTimeout(() => {
      if (socketClient) {
        socketClient.stopTyping(receiverId);
      }
    }, 3000);
  }
};

/**
 * Get current user ID
 * @returns {string} - User ID
 */
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user._id || user.id || user.userId;
    }
  } catch (error) {
    console.error('Error getting current user ID:', error);
  }
  return null;
};

/**
 * Format time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time
 */
const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return d.toLocaleDateString();
};

/**
 * Escape HTML
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Setup message input handlers
document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      } else {
        handleTyping();
      }
    });

    messageInput.addEventListener('input', handleTyping);
  }

  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }
});

// Export functions for global access
window.messaging = {
  openConversation,
  startConversation,
  sendMessage,
  loadConversations,
};
