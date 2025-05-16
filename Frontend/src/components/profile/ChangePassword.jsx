import React, { useState } from "react";
import * as authApi from "../../api/authApi";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [error, setError]                     = useState("");
  const [successMessage, setSuccessMessage]   = useState("");
  const [submitting, setSubmitting]           = useState(false);

  const validateAndSubmit = async () => {
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

    setSubmitting(true);
    try {

      const { data } = await authApi.changePassword({ currentPassword, newPassword });
      setSuccessMessage(data.message); 
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
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
            disabled={submitting}
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
            disabled={submitting}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button
          className="change-password-button"
          onClick={validateAndSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
