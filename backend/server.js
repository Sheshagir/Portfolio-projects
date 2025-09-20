const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load .env

const app = express();
app.use(cors());
app.use(express.json());

// 📩 Contact API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const msgData = {
    name,
    email,
    message,
    date: new Date().toISOString(),
  };

  try {
    // Gmail SMTP config using environment variables
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,    // from .env
        pass: process.env.PASSWORD, // from .env (app password)
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL,
      subject: `Portfolio Contact: ${name}`,
      text: message,
    });

    saveMessage(msgData);
    res.json({ message: "✅ Message sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    saveMessage(msgData);
    res.status(500).json({ message: "⚠️ Failed to send email, but saved to backup." });
  }
});

// ✅ Save messages to messages.json
function saveMessage(data) {
  const filePath = path.join(__dirname, "messages.json");
  let messages = [];

  if (fs.existsSync(filePath)) {
    try {
      messages = JSON.parse(fs.readFileSync(filePath));
    } catch {
      messages = [];
    }
  }

  messages.push(data);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

// ✅ Get all messages
app.get("/messages", (req, res) => {
  const filePath = path.join(__dirname, "messages.json");
  if (!fs.existsSync(filePath)) return res.json({ messages: [] });

  try {
    const messages = JSON.parse(fs.readFileSync(filePath));
    res.json({ messages });
  } catch {
    res.json({ messages: [] });
  }
});

// ✅ Test route
app.get("/", (req, res) => res.send("Backend is running ✅"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
