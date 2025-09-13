// src/config.js
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL   // from .env in production
    : "http://localhost:5000";            // local dev backend

export const API_URL = `${BASE_URL}/api`;
