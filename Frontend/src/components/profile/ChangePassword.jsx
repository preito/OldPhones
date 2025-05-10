import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateAndSubmit = () => {
    setError("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    // Placeholder for actual submission logic
    console.log("Submitting:", { currentPassword, newPassword });
    setSuccessMessage("Password changed successfully (mock)");
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <div className="change-password-input-container">
        <div className="change-password-input-item">
          <label>Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="change-password-input-item">
          <label>New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button className="change-password-button" onClick={validateAndSubmit}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
