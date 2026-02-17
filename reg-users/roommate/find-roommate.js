const filterOptions = {
  "Gender Preference": ["Male only", "Female only", "No preference"],
  "Age Range": ["15-18", "18-25", "25-30", "30-45", "45-65", "65 & above"],
  "Smoking / Drinking": [
    "Not okay with either",
    "Okay with drinking only",
    "Okay with smoking only",
  ],
  "Health Issues": ["Disabled", "Fit 100%"],
  Guest: ["Rarely", "Occasionally", "Often", "No guest allowed"],
  "Move in Timeline": [
    "Immediaely",
    "Within 1 month",
    "1 -3 months",
    "flexible / not sure when",
  ],
  "Work / Daily Schedule": [
    "Student(mostly out)",
    "Student(mostly home)",
    "Working(office based)",
    "Working (remote based)",
    "Self-employed",
  ],
  "Cleaniness Level": [
    "Low (easy-going",
    "High (Very neat",
    "Medium (reasonably tidy)",
  ],
  "Lifestyle Vibe": ["Quite & private", "Balanced", "Social & friendly"],
  "Rent Price, Yearly,  N ": [
    "100 -200k",
    "200 - 400k",
    "400 -600k",
    "600 - 800k",
    "800 -1M",
    "1M - 2M",
    "2M & above",
  ],
};

let selectedFilters = {};

function initializeFilters() {
  Object.keys(filterOptions).forEach((category) => {
    selectedFilters[category] = [];
  });
}

function createFilterSection(category, options) {
  const section = document.createElement("div");
  section.className = "filter-section";

  const header = document.createElement("button");
  header.className = "section-header";
  header.innerHTML = `
                <span>${category}</span>
                <svg class="section-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>         
            `;

  const content = document.createElement("div");
  content.className = "section-content";

  options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "checkbox-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${category}-${option}`;
    checkbox.value = option;

    const label = document.createElement("label");
    label.htmlFor = `${category}-${option}`;
    label.textContent = option;

    checkbox.addEventListener("change", (e) => {
      handleCheckboxChange(category, option, e.target.checked);
    });

    optionDiv.appendChild(checkbox);
    optionDiv.appendChild(label);
    optionDiv.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleCheckboxChange(category, option, checkbox.checked);
      }
    });

    content.appendChild(optionDiv);
  });
  header.addEventListener("click", () => {
    header.classList.toggle("active");
    content.classList.toggle("active");
  });

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

function handleCheckboxChange(category, option, isChecked) {
  if (isChecked) {
    if (!selectedFilters[category].includes(option)) {
      selectedFilters[category].push(option);
    }
  } else {
    selectedFilters[category] = selectedFilters[category].filter(
      (item) => item !== option,
    );
  }
  updateFilterCount();
}

function updateFilterCount() {
  const count = Object.values(selectedFilters).flat().length;
  const filterCountDiv = document.getElementById("filterCount");
  const countBadge = document.getElementById("countBadge");

  countBadge.textContent = count;

  if (count > 0) {
    filterCountDiv.classList.add("active");
  } else {
    filterCountDiv.classList.remove("active");
  }
}

function resetFilters() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  Object.keys(selectedFilters).forEach((category) => {
    selectedFilters[category] = [];
  });

  updateFilterCount();
}

function applyFilters() {
  console.log("Applied filters:", selectedFilters);

  const filterSummary = Object.entries(selectedFilters)
    .filter(([_, values]) => values.length > 0)
    .map(([category, values]) => `${category}: ${values.join(", ")}`)
    .join("\n");

  if (filterSummary) {
    alert("Filters applied!\n\n" + filterSummary);
  } else {
    alert("No filters selected");
  }
}
function init() {
  initializeFilters();

  const sectionsContainer = document.getElementById("filterSections");

  Object.entries(filterOptions).forEach(([category, options]) => {
    const section = createFilterSection(category, options);
    sectionsContainer.appendChild(section);
  });

  document.getElementById("resetBtn").addEventListener("click", resetFilters);
  document.getElementById("filterBtn").addEventListener("click", applyFilters);
}

init();

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
    const targetTab = button.getAttribute("data-tab");

    // Remove active class from all buttons
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    tabContents.forEach((content) => content.classList.remove("active"));
    // Show the target tab content
    const targetContent = document.getElementById(`${targetTab}-tab`);
    targetContent.classList.add("active");
  });
});

// Get all the DOM elements
let currentStep = 0;
const totalSteps = steps.length;

// When page loads, show first step
initialize();

function initialize() {
  showStep(0);
  updateUI();
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

function updateButtons() {
  prevBtn.disabled = currentStep === 0;

  const isLastStep = currentStep === totalSteps - 1;
  nextBtn.style.display = isLastStep ? "none" : "block";
}

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

nextBtn.addEventListener("click", handleNext);
prevBtn.addEventListener("click", handlePrevious);
form.addEventListener("submit", handleSubmit);
