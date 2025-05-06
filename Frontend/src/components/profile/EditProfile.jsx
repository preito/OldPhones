import React from "react";

const EditProfile = () => {
  return (
    <div className="edit-profile-container">
        <h2>Edit Profile</h2>
      <div className="edit-profile-input-container">
        <div className="input-item">
          <label>First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value="Prefilled value"
          />
        </div>
        <div className="input-item">
          <label>Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value="Prefilled value"
          />
        </div>
        <div className="input-item">
          <label>Email</label>
          <input type="email" id="email" name="email" value="Prefilled value" />
        </div>
      </div>

        <button>Update profile</button>

    </div>
  );
};
export default EditProfile;
