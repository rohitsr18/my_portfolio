document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thanks for your message! I'll get back to you shortly.");
  this.reset();
});
