import React from "react";
import "./Navbar.css";

const Navbar = ({ setActiveTab }) => {
  return (
    <header className="profile-header">
      <nav>
        <div className="logo">
          <a href="/">Home</a>
        </div>
        <ul>
          <button onClick={() => setActiveTab("edit")}>Edit Profile</button>
          <button onClick={() => setActiveTab("change")}>
            Change Password
          </button>
          <button onClick={() => setActiveTab("manage")}>
            Manage Listings
          </button>
          <button onClick={() => setActiveTab("view")}>View Comments</button>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
