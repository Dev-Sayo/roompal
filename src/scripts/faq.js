"use-strict";
const faqQuestions = document.querySelectorAll(".faq-question");
const questions = document.querySelectorAll(".faq-question");

questions.forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const icon = question.querySelector(".faq-icon");

    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      icon.style.transform = "rotate(0deg)";
    } else {
      document.querySelectorAll(".faq-answer").forEach((a) => {
        a.style.maxHeight = null;
        a.previousElementSibling.querySelector(".faq-icon").style.transform =
          "rotate(0deg)";
      });

      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
    }
  });
});
