const successMessage = document.getElementById("verify-email");
const openBtn = document.getElementById("openModal");

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

successMessage.addEventListener("click", () => {
  successMessage.style.display = "block";
});
