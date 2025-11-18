const express = require("express");
const Feedback = require("../model/feedback");
const router = express.Router();

// Save a new feedback
router.post("/", async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: "Feedback is required" });
    }

    const saved = await Feedback.create({ feedback });
    return res.status(200).json({ message: "Feedback submitted", saved });
  } catch (error) {
    console.error("❌ Feedback save error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all feedback for admin
router.get("/", async (req, res) => {
  try {
    const list = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json(list);
  } catch (error) {
    console.error("❌ Feedback fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
