const express = require("express");
const Feedback = require("../model/feedback");
const router = express.Router();

// ----------- SAVE FEEDBACK -----------
router.post("/", async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: "Feedback is required" });
    }

    const savedFeedback = await Feedback.create({ feedback });

    res.json({ message: "Feedback submitted successfully", savedFeedback });
  } catch (error) {
    console.error("Feedback save error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------- GET ALL FEEDBACKS (ADMIN) -----------
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Feedback fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
