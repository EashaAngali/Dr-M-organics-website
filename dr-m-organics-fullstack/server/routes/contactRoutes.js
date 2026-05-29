import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  const html = `
    <div style="font-family:Arial,sans-serif;">
      <h2>New Contact Message - Dr M Organics</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;

  try {
    if (process.env.ADMIN_NOTIFY_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `New Contact Message from ${name}`,
        html
      });
    }
  } catch (error) {
    console.error("Contact email error:", error.message);
  }

  res.status(201).json({ message: "Message sent successfully" });
});

export default router;
