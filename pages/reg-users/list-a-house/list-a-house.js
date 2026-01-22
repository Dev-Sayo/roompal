const steps = document.querySelectorAll(".step-content");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const stepCounter = document.getElementById("current-index");

let currentStep = 1;

function updateDisplay() {
  // 1. Show/Hide Step Content
  steps.forEach((step, index) => {
    step.classList.toggle("hidden", index + 1 !== currentStep);
  });

  // 2. Update Counter Text
  stepCounter.innerText = currentStep;

  // 3. Handle Button Visibility/Text
  prevBtn.classList.toggle("invisible", currentStep === 1);

  if (currentStep === steps.length) {
    nextBtn.innerText = "Finish";
    nextBtn.classList.replace("bg-blue-600", "bg-green-600");
  } else {
    nextBtn.innerText = "Next";
    nextBtn.classList.replace("bg-green-600", "bg-blue-600");
  }
}

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length) {
    currentStep++;
    updateDisplay();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateDisplay();
  }
});
