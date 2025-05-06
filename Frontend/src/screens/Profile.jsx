import Navbar from "../components/profile/Navbar";
import EditProfile from "../components/profile/EditProfile";
import ChangePassword from "../components/profile/ChangePassword";
import ManageListings from "../components/profile/ManageListings";
import ViewComments from "../components/profile/ViewComments";
import "./Profile.css";
import { useState } from "react";
import React from 'react'

const Profile = () => {

  const [activeTab, setActiveTab] = useState('edit');

  return (
    <div>
    <Navbar setActiveTab={setActiveTab}></Navbar>
    <div className="tab-content">
        {activeTab === 'edit' && <EditProfile />}
        {activeTab === 'change' && <ChangePassword />}
        {activeTab === 'manage' && <ManageListings />}
        {activeTab === 'view' && <ViewComments />}
      </div>
    </div>
    

  )
}

export default Profile