import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "../authAxios";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await authAPI.post("/register", form);
      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="text-center mb-4">Create Account</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            className="form-control mb-3"
            name="username"
            placeholder="Username / Email"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-success w-100">Register</button>
        </form>

        <p className="text-center mt-4 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
