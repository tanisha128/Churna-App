export const BASE_URL =
  import.meta.env.MODE === "production"
    ? ""
    : "http://localhost:5000"; // match backend port

export const API_URL = `${BASE_URL}/api`;
