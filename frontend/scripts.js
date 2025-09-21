// ===== Contact Form (Validation + Backend Submit) =====
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const message = e.target.message.value.trim();
    const statusMsg = document.getElementById("statusMsg");

    // Validation
    if (!name || !email || !message) {
      statusMsg.innerText = "⚠️ Please fill in all required fields.";
      return;
    }
    
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(emailPattern)) {
      statusMsg.innerText = "⚠️ Please enter a valid email address.";
      return;
    }

    // Send to backend
    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      statusMsg.innerText = data.message;
      form.reset();
    } catch (err) {
      console.error("Error:", err);
      statusMsg.innerText = "❌ Error sending message.";
    }
  });
}
