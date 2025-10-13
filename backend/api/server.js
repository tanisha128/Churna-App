const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const serverless = require("serverless-http");

const productRoutes = require("../routes/productRoutes");
const authRoutes = require("../routes/authRoutes");
const orderRoutes = require("../routes/orderRoutes");
const User = require("../model/user");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // ✅ allow React local frontend
      "https://oxyjainherbalcare.in",
      "https://www.oxyjainherbalcare.in",
      "https://oxyjainherbalcare.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api", (req, res) => {
  res.send("✅ Backend running locally or on Vercel");
});

// ================= CONTACT FORM =================
app.post("/api/contact", (req, res) => {
  const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

  if (!firstName || !email || !phoneNumber || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Form Submission: ${subject}`,
    text: `
      First Name: ${firstName}
      Last Name: ${lastName || "Not provided"}
      Email: ${email}
      Phone Number: ${phoneNumber}
      Subject: ${subject}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    createDefaultAdmin();
  })
  .catch((err) => console.error("❌ DB connection error:", err));

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
      await User.create({ email, password: hashedPassword, role: "admin" });
      console.log(`✅ Admin created: ${email}`);
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}

// ✅ Local development: start Express normally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Vercel: export for serverless
module.exports = app;
module.exports.handler = serverless(app);




