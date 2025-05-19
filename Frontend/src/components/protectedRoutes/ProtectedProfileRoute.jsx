
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading,logout } = useAuth();

  if (loading) {
    return <div>Loading…</div>;
  }

  if (!user) {
    // not logged in? bounce back to home
    return <Navigate to="/" replace />;
  }

  if (user?.sadmin === true) {
    logout();
  }

  // logged in! render whatever nested route matched
  return <Outlet />;
}
