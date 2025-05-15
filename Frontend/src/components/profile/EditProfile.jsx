import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./EditProfile.css";

export default function EditProfile() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!loading && user) {
      setFormData({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [loading, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call update-profile API with formData
    console.log("Update profile with:", formData);
  };

  if (loading) {
    return <div>Loading profile…</div>;
  }

  return (
    <form className="edit-profile-container" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <div className="edit-profile-input-container">
        <div className="edit-profile-input-item">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-profile-input-item">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-profile-input-item">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-profile-input-item">
          <label htmlFor="password">Current Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter current password"
            required
          />
        </div>
      </div>

      <button type="submit" className="edit-profile-button">
        Update Profile
      </button>
    </form>
  );
}
