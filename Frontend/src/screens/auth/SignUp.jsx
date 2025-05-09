import React from "react";
import "./SignUp.css";

const SignUp = () => {
  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>

      <div className="signup-input-container">
        <div className="signup-input-item">
          <label>First Name</label>
          <input type="text" id="firstName" name="firstName" />
        </div>
        <div className="signup-input-item">
          <label>Last Name</label>
          <input type="text" id="lastName" name="lastName" />
        </div>
        <div className="signup-input-item">
          <label>Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="signup-input-item">
          <label>Password</label>
          <input type="password" id="password" name="password" />
        </div>

        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
};

export default SignUp;
