import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import * as authApi from "../../api/authApi";
import "./ResetPassword.css";
import HomeLink from "../../components/profile/HomeLink";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token || !email) {
      setError("Invalid password reset link, Please try again.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.resetPassword({
        token,
        email,
        newPassword: password,
      });
      setStatus(data.message);
      setTimeout(() => navigate("/signin"), 3000); // Again, maybe let the user navigate back themselves.
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
     <HomeLink className="home-icon" />
      <div className="signup-container">
        <form className="reset-input-container" onSubmit={handleSubmit}>
          <h2 className="reset-title">Set a New Password</h2>
          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="reset-input-item">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <div className="reset-input-item">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? "Saving…" : "Save New Password"}
          </button>

          <p className="reset-links">
            <Link to="/signin">Back to Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
