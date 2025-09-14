// src/config.js
const BASE_URL =
  process.env.MODE === "production"
    ? process.env.VITE_BACKEND_URL  // from .env in production
    : "http://localhost:5000";            // local dev backend

export const API_URL = `${BASE_URL}/api`;
