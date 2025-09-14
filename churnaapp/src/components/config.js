// src/config.js
const BASE_URL =
  process.env.MODE === "production"
     ? "" // same domain in production 
    : "http://localhost:5000";            // local dev backend

export const API_URL = `${BASE_URL}/api`;
