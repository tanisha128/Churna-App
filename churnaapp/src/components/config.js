// src/config.js
// config.js
export const API_URL =
  import.meta.env.MODE === "production"
    ? ""                 // same domain in production
    : "http://localhost:5000/api"; // local dev backend
