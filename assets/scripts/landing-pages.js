"use-strict";
// nav dropdown
const dropdownBox = document.getElementById("myDropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownContent = document.querySelector(".dropdown-content");
const dropdownItems = document.querySelectorAll("a");
const track = document.querySelector(".review-track");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// dropdown in navbar
dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownBox.classList.toggle("active");
});

document.addEventListener("click", function () {
  dropdownBox.classList.remove("active");
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Mobile dropdown toggle
const mobileDropdownBtn = document.getElementById("mobile-dropdown-btn");
const mobileDropdownMenu = document.getElementById("mobile-dropdown-menu");

mobileDropdownBtn.addEventListener("click", () => {
  mobileDropdownMenu.classList.toggle("hidden");
});

// Faq
// const faqQuestions = document.querySelectorAll(".faq-question");
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
// review
const reviews = [
  {
    name: "Sofia Andrade",
    role: "Product Designer",
    text: "The roommate matching actually works. I was worried about living with a stranger, but the lifestyle matching helped a lot. We get along really well..",

    photo: "../assets/images/man-1.png",
  },
  {
    name: "Camille Dubois",
    role: "Marketing Lead",
    text: "Our conversion rate improved by 40% within the first month. I honestly didn't expect results this quickly.",
    photo: "../assets/images/man-2.png",
  },
  {
    name: "James Okonkwo",
    role: "CTO at Launchpad",
    text: "Clean API, excellent documentation, and it just works. No fighting with edge cases or broken integrations.",
    photo: "../assets/images/man-3.png",
  },
  {
    text: "I've recommended this to everyone on my team. The onboarding is smooth and the learning curve is basically zero.",
    name: "Priya Nair",
    role: "UX Researcher",
    photo: "../assets/images/man-4.png",
  },
  {
    text: "Replaced our entire review workflow with this. Setup took 20 minutes. Results were immediate and impressive.",
    name: "Luca Ferretti",
    role: "E-commerce Manager",
    photo: "../assets/images/man-1.png",
  },
  {
    text: "The analytics alone are worth it. I finally understand what my audience actually cares about. Total game changer.",
    name: "Amara Osei",
    role: "Content Strategist",
    photo: "../assets/images/man-1.png",
  },
];

function getInitial(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function buildCard(review) {
  const div = document.createElement("div");
  div.className = "review-card";
  div.innerHTML = `
        <p class="review-text">${review.text}</p>
        <div class="card-bottom">
          <div class="review-side">
            <div class="avatar"><img src="${review.photo}" alt="${review.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
        <div class="reviewer-info">
            <div class="reviewer-name">${review.name}</div>
            <div class="reviewer-meta">${review.role}</div>
          </div>
            </div>
        </div>
      `;
  return div;
}

function populateTrack(trackId, reviewSubset) {
  const track = document.getElementById(trackId);
  // Duplicate cards for seamless loop
  [...reviewSubset, ...reviewSubset].forEach((review) => {
    track.appendChild(buildCard(review));
  });
}

// Duplicate cards for seamless bounce loop
populateTrack("track-1", reviews.concat(reviews));
