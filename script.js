// Sidebar toggle for mobile
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Example: Notification click interaction
document.querySelectorAll(".box")[0].addEventListener("click", () => {
  alert("You have upcoming exams. Please check details in ERP!");
});