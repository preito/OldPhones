import React from "react";

const ChangePassword = () => {
  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <div className="change-password-input-container">
        
        <div className="input-item">
          <label>Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
          />
        </div>

        <div className="input-item">
          <label>New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
          />
        </div>
        <button>Confirm</button>
      </div>
    </div>
  );
};

export default ChangePassword;
