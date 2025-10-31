require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: `Test <${process.env.EMAIL_USER}>`,
  to: 'yourpersonal@gmail.com',
  subject: 'Test Mail',
  text: 'If you got this, nodemailer works!',
})
.then(() => console.log('✅ Email sent successfully!'))
.catch(err => console.error('❌ Error:', err));
