import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading…</div>;
  }

  if (!user) {
    return <div>Please Sign In to view your profile</div>;
  }

  return children;
}
