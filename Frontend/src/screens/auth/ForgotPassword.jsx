import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as authApi from "../../api/authApi";
import "./ForgotPassword.css";

import HomeLink from "../../components/profile/HomeLink";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setStatus("Verification link sent! Check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <HomeLink className="home-icon" />
      <div className="reset-container">
        <form className="reset-input-container" onSubmit={handleSubmit}>
          <h2 className="reset-title">Reset Password</h2>

          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="reset-input-item">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </button>

          <p className="reset-links">
            Remembered? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
