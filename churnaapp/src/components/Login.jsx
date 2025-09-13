import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

   const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/auth/admin'
  : 'http://localhost:5000/api/auth/admin';

fetch(API_URL)

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");
        navigate("/dashboard"); // 👈 Redirect here
      } else {
        setMessage("❌ " + (data.error || data.message || "Login failed"));
      }
    } catch (error) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="admin">
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
       
      />
      <button onClick={handleLogin} >
        Login
      </button>
      <p>{message}</p>
    </div>
  );
}
