const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const productRoutes = require('./routes/productRoutes');
const app = express();
const PORT = process.env.PORT || 8000;
const authRoutes = require('./routes/authRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const bcrypt = require('bcryptjs');
const User = require('./model/user.js');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));



//Routes
app.use("/api/products",productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});





app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

  if (!firstName || !email || !phoneNumber || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Use environment variable
    subject: `Contact Form Submission: ${subject}`,
    text: `
      First Name: ${firstName}
      Last Name: ${lastName || 'Not provided'}
      Email: ${email}
      Phone Number: ${phoneNumber}
      Subject: ${subject}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

//connect to database
mongoose.connect(process.env.URL).then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

async function createDefaultAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
      return;
    }

    const existing = await User.findOne({ email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`✅ Admin created: ${email}`);
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}

createDefaultAdmin();




