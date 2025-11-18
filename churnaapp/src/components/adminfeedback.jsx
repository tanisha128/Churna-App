import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import "./adminfeed.css";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/feedback`)
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-feedback-container">
      <h2>Customer Feedback</h2>

      {feedbacks.length === 0 && (
        <p>No customer feedback yet.</p>
      )}

      {feedbacks.map(f => (
        <div key={f._id} className="feedback-card">
          <p>{f.feedback}</p>
          <small>{new Date(f.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
