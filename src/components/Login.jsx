import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "../authAxios";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.post("/login", form);
      const token = response.data?.token || response.data;

      if (!token || typeof token !== "string") {
        throw new Error("Login succeeded but no JWT token was returned.");
      }

      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Login failed. Check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const oauthLogin = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:8080"
    }/oauth2/authorization/${provider}`;
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
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

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center my-3">OR</div>

        <button
          className="btn btn-outline-dark w-100 mb-2"
          onClick={() => oauthLogin("google")}
        >
          Continue with Google
        </button>

        <button
          className="btn btn-outline-secondary w-100"
          onClick={() => oauthLogin("github")}
        >
          Continue with GitHub
        </button>

        <p className="text-center mt-4 mb-0">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
