import React from "react";
import "./ChangePassword.css"

const ChangePassword = () => {
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
      />
    </div>
    <div className="change-password-input-item">
      <label>New Password</label>
      <input
        type="password"
        id="newPassword"
        name="newPassword"
      />
    </div>
    <button className="change-password-button">Confirm</button>
  </div>
</div>
  );
};

export default ChangePassword;
