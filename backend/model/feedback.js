const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    feedback: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
