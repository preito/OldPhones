import React from "react";
import "./EditProfile.css";

const EditProfile = () => {
  return (

    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <div className="edit-profile-input-container">
        <div className="edit-profile-input-item">
          <label>First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value="Prefilled value"
          />
        </div>
        <div className="edit-profile-input-item">
          <label>Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value="Prefilled value"
          />
        </div>
        <div className="edit-profile-input-item">
          <label>Email</label>
          <input type="email" id="email" name="email" value="Prefilled value" />
        </div>
        <div className="edit-profile-input-item">
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value="Prefilled pass"
          />
        </div>
      </div>
      <button className="edit-profile-button">Update profile</button>
    </div>
  );
};
export default EditProfile;
