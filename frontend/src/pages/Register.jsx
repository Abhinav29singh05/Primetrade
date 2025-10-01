import { useState } from "react";
import API from "../api";
import "../styles/register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // First register the user
      const registerResponse = await API.post("/users/register", form);
      if (registerResponse.status === 201) {
        try {
          // If registration successful, immediately log in
          const loginResponse = await API.post("/users/login", {
            email: form.email,
            password: form.password
          });
          
          // Store the token and user data
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
          
          window.location.href = "/dashboard";
        } catch (loginErr) {
          // If login fails after registration
          setError("Registration successful but login failed. Please go to login page.");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || " Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {error && <div className="error-box">{error}</div>}

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>

        <p className="redirect-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
