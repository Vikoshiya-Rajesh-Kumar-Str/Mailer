const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  // Log email configuration
  console.log("EMAIL USER:", process.env.GMAIL_USER);
  console.log("EMAIL PASS:", process.env.GMAIL_PASS ? "✓ exists" : "✗ missing");
  console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL || "vikoshiya.rajeshkumar@gmail.com");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Admin notification email
    const adminMail = {
      from: `"Website Form" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "vikoshiya.rajeshkumarstr@gmail.com",
      subject: "📩 New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    };

    // User confirmation email
    const userMail = {
      from: `"Vikoshiya Technologies" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting us!",
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <br>
        <p>Best regards,</p>
        <p>– Vikoshiya Team</p>
      `,
    };

    try {
      // Send admin notification first
      console.log("Sending admin notification...");
      await transporter.sendMail(adminMail);
      console.log("Admin notification sent successfully");
    } catch (adminError) {
      console.error("Failed to send admin notification:", adminError);
      // Continue to send user email even if admin email fails
    }

    try {
      // Send user confirmation
      console.log("Sending user confirmation...");
      await transporter.sendMail(userMail);
      console.log("User confirmation sent successfully");
    } catch (userError) {
      console.error("Failed to send user confirmation:", userError);
      throw userError; // Re-throw to be caught by outer try-catch
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;
