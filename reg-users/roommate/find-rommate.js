const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const form = document.getElementById("propertyForm");
const steps = document.querySelectorAll(".selector");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stepCounter = document.getElementById("stepCounter");
const successMessage = document.getElementById("successMessage");

// Add click event to each tab button
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the data-tab attribute value
    const targetTab = button.getAttribute("data-tab");

    // Remove active class from all buttons
    tabButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Hide all tab contents
    tabContents.forEach((content) => content.classList.remove("active"));

    // Show the target tab content
    const targetContent = document.getElementById(`${targetTab}-tab`);
    targetContent.classList.add("active");
  });
});

// Get all the DOM elements

// Track which step we're on
let currentStep = 0;
const totalSteps = steps.length;

// When page loads, show first step
initialize();

function initialize() {
  showStep(0); // Show first step
  updateUI(); // Update buttons and counter
}

// Show a specific step
function showStep(stepIndex) {
  steps.forEach((step) => step.classList.remove("active"));
  steps[stepIndex].classList.add("active");
}

// Update the step counter
document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("my-element");
  if (element) {
    element.textContent = "New Content";
  }
});

// Update button states
function updateButtons() {
  prevBtn.disabled = currentStep === 0;

  const isLastStep = currentStep === totalSteps - 1;
  nextBtn.style.display = isLastStep ? "none" : "block";
}

// Update everything
function updateUI() {
  updateStepCounter();
  updateButtons();
}

// Simulate async operation
async function simulateAsyncOperation(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// Hide current step with animation
async function hideCurrentStep() {
  return new Promise((resolve) => {
    const currentStepElement = steps[currentStep];
    currentStepElement.classList.add("hiding");

    setTimeout(() => {
      currentStepElement.classList.remove("active", "hiding");
      resolve();
    }, 300);
  });
}

// Show current step with animation
async function showCurrentStep() {
  return new Promise((resolve) => {
    const currentStepElement = steps[currentStep];
    currentStepElement.classList.add("active");

    setTimeout(() => {
      resolve();
    }, 400);
  });
}

// Handle "Next" button click
async function handleNext() {
  nextBtn.classList.add("loading");
  nextBtn.disabled = true;

  try {
    await simulateAsyncOperation(300);
    await hideCurrentStep();
    currentStep++;
    await showCurrentStep();
    updateUI();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    nextBtn.classList.remove("loading");
    nextBtn.disabled = false;
  }
}

// Handle "Previous" button click
async function handlePrevious() {
  prevBtn.classList.add("loading");
  prevBtn.disabled = true;

  try {
    await simulateAsyncOperation(200);
    await hideCurrentStep();
    currentStep--;
    await showCurrentStep();
    updateUI();
  } finally {
    prevBtn.classList.remove("loading");
    prevBtn.disabled = false;
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simulate API call
    await simulateAsyncOperation(1500);

    // Hide form, show success
    steps[currentStep].style.display = "none";
    document.querySelector(".button-group").style.display = "none";
    successMessage.classList.add("show");

    console.log("Form submitted:", data);
  } catch (error) {
    console.error("Submission error:", error);
    alert("Failed to submit. Please try again.");
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
}

// Attach event listeners
nextBtn.addEventListener("click", handleNext);
prevBtn.addEventListener("click", handlePrevious);
form.addEventListener("submit", handleSubmit);
