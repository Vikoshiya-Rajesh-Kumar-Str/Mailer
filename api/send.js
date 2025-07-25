const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and phone are required'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const adminMail = {
      from: `"Website Form" <${process.env.GMAIL_USER}>`,
      to: "vikoshiya.rajeshkumarstr@gmail.com",
      subject: "📩 New User Submission",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`
    };

    const userMail = {
      from: `"Vikoshiya Technologies" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting us!",
      text: `Hi ${name},\n\nWe received your message and will get back to you shortly.\n\n– Vikoshiya Team`
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.'
    });
  }
};
