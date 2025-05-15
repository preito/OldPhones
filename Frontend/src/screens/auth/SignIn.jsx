// src/pages/SignIn.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SignIn.css";

const SignIn = ({ onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { success, message, user } = await login(email, password);

    if (success) {
      if (user?.sadmin=== true) {
        navigate("/admin")
      } else {
        navigate("/");
      }
    } else {
      setError(message);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-input-container" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="signin-input-item">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="signin-input-item">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="signin-button"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="signin-links">
          <Link to="/forgot-password" className="reset-link">
            Forgot password?
          </Link>
          <span className="divider">|</span>
          <Link to="/signup" className="signup-link">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
