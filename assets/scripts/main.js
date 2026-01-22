"use strict";
// nav dropdown
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const dropdownItems = document.querySelectorAll(".dropdown-items");

dropdownBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("active");
});

const regiterRoute = document.querySelectorAll(".registerRoute");

regiterRoute.forEach((route) => {
  route.addEventListener("click", () => {
    window.location.href = "register.html";
    route.classList.add;
    route.textContent = "Create Account";
  });
});
