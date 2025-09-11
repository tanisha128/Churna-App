// utils/email.js
const nodemailer = require("nodemailer");

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
      from: `Ayurveda Shop <${process.env.EMAIL_USER}>`,
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
