// utils/email.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config(); // ✅ Load .env variables here

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send mail
async function sendMail({ to, subject, text, html }) {
  try {
    await transporter.sendMail({
      from: `Oxyjain Herbal Care <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email error: ${err.message}`);
  }
}

module.exports = sendMail;

