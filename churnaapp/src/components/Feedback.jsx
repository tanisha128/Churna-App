import React, { useState } from "react";
import { API_URL } from "./config";
import "./feedback.css";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Thank you for your feedback!");
      setFeedback("");
    } else {
      alert(data.error || "Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-page">
      <h1>Suggestion / Feedback</h1>
      
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="6"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
