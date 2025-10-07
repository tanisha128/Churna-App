
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import serverless from "serverless-http";
import { fileURLToPath } from "url";

import productRoutes from "../routes/productRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import User from "../model/user.js";

dotenv.config();

// Vercel doesn't have __dirname, so we define it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));

app.use(
  cors({
    origin: ["https://oxyjainherbalcare.vercel.app"], // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===== API ROUTES =====
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api", (req, res) => {
  res.send("Backend running on Vercel ✅");
});

// ===== CONTACT FORM EMAIL =====
app.post("/api/contact", async (req, res) => {
  try {
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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Error sending email" });
  }
});

// ===== DATABASE CONNECTION =====
mongoose
  .connect(process.env.URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

async function createDefaultAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) return;

    const existing = await User.findOne({ email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, password: hashedPassword, role: "admin" });
      console.log(`✅ Admin created: ${email}`);
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}
createDefaultAdmin();

// ✅ export the app instead of serverless(app)
export default app;
