"use strict";
const regiterRoute = document.querySelectorAll(".registerRoute");

regiterRoute.forEach((route) => {
  route.addEventListener("click", () => {
    window.location.href = "register.html";
    route.classList.add;
    route.textContent = "Create Account";
  });
});
