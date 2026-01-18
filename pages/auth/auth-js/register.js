"use strict";
const myForm = document.getElementById("register-form");
const successMessage = document.getElementById("verify-email");
let eyeIccon = document.getElementById("eyeicon");

function errorMessage(input, message) {
  const errorDiv = document.getElementById(input.id + "Error");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
  input.classList.add("error-border");
  valid = false;
}

// function validateEmail(email) {
//   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailPattern.test(email);
// }

function clearError() {
  const errorDivs = document.querySelectorAll(".error");
  errorDivs.forEach((div) => (div.style.display = "none"));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => input.classList.remove("error-border"));
}

myForm.addEventListener("submit", (e) => {
  e.preventDefault();

  clearError();

  //   input
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  let valid = true;

  //   inputs validations
  if (name.value.trim().length <= 2) {
    errorMessage(name, "name must be at least two character");
  }

  //   email validation
  if (!email.value.includes("@") || !email.value.includes(".com")) {
    errorMessage(email, "please enter a valid email address");
  }

  //   password vlidation
  if (
    !password.value.includes("#") ||
    password.value.length < 8 ||
    password === ""
  ) {
    errorMessage(password, "please enter at least 8 digits password with #");
  }

  // confirm password validation
  if (!confirmPassword === password) {
    errorMessage(confirmPassword, "Password does not match");
  }

  if (valid) {
    const formData = {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };
    console.log("Submitted successfully");
    console.log(formData);

    successMessage.style.display = "block";

    //
    myForm.reset();
  }
});
