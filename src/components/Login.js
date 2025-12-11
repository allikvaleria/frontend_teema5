// LoginPage.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://localhost:7284/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, parool: password }),
      });

      if (!res.ok) {
        const text = await res.text();
        return alert("Login failed: " + text);
      }

      const data = await res.json();
      // data: { token, role, name }
      login(data.token, data.role, data.name);

      // Перенаправление после логина
      if (data.role.toLowerCase() === "admin") navigate("/admin");
      else navigate("/klient");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: 10, margin: "10px 0" }}
      />
      <input
        type="password"
        placeholder="Parool"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: 10, margin: "10px 0" }}
      />
      <button type="submit" style={{ padding: 10, width: "100%", background: "#5a2ca0", color: "#fff", border: "none", borderRadius: 6 }}>
        Logi sisse
      </button>
    </form>
  );
}
