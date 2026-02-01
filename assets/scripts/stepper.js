// Get all the DOM elements
const form = document.getElementById("propertyForm");
const steps = document.querySelectorAll(".selector");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const stepCounter = document.getElementById("stepCounter");
const successMessage = document.getElementById("successMessage");

// Track which step we're on
let currentStep = 0;
const totalSteps = steps.length;

// When page loads, show first step
initialize();

function initialize() {
  showStep(0);
  updateUI();
}

function showStep(stepIndex) {
  steps.forEach((step) => step.classList.remove("active"));
  steps[stepIndex].classList.add("active");
}

// Update the step counter
function updateStepCounter() {
  stepCounter.textContent = `${currentStep + 1}/${totalSteps}`;
}

// Update everything
function updateUI() {
  updateStepCounter();
}

async function simulateAsyncOperation(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// Hide current step
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

// Show current step
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
