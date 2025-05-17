import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SignOutModal from "../auth/SignOutModal";
import "./Navbar.css";
import HomeLink from '../../components/profile/HomeLink';

export default function Navbar({ setActiveTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirmSignOut = async () => {
    setIsModalOpen(false);
    await logout();
    navigate('/signin');
  };

  const handleCancelSignOut = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="profile-header">
      <nav>
        <HomeLink className='profile-home-link' />
        <ul>
          <button onClick={() => setActiveTab("edit")}>Edit Profile</button>
          <button onClick={() => setActiveTab("change")}>Change Password</button>
          <button onClick={() => setActiveTab("manage")}>Manage Listings</button>
          <button onClick={() => setActiveTab("view")}>View Comments</button>
          <button onClick={() => setIsModalOpen(true)}>Log Out</button>
        </ul>
      </nav>
      <SignOutModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </header>
  );
}
