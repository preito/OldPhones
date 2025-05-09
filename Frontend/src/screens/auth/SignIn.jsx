import React, { useState } from "react";
import "./SignIn.css";

const SignIn = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: validate inputs, call your sign-in API, handle errors
    console.log("Signing in with", { email, password });
  };

  return (
    <div className="signin-container">
      <form className="signin-input-container" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In</h2>

        <div className="signin-input-item">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
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
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="signin-button">
          Sign In
        </button>

        <div className="signin-links">
          <a href="/reset-password" className="reset-link">
            Forgot password?
          </a>
          <span className="divider">|</span>
          <button
            type="button"
            className="switch-button"
            onClick={onSwitchToSignUp}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
