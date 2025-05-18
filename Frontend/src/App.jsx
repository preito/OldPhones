
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import MainPage from "./screens/MainPage";
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import EmailSent from "./screens/auth/EmailSent";
import VerifyEmail from "./screens/auth/VerifyEmail";
import ForgotPassword from "./screens/auth/ForgotPassword";
import ResetPassword from "./screens/auth/ResetPassword";

import Profile from "./screens/Profile";
import CheckoutPage from "./screens/CheckoutPage";
import Wishlist from "./screens/Wishlist";

import ProtectedRoute from "./components/protectedRoutes/ProtectedProfileRoute";

import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./screens/admin/AdminHome";
import UserManagement from "./screens/admin/UserManagement";
import ListingManagement from "./screens/admin/ListingManagement";
import ContentModeration from "./screens/admin/ContentModeration";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="h-full w-full">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/email-sent" element={<EmailSent />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* User‐protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>

              {/* Admin routes (will add separate protection later) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="listings" element={<ListingManagement />} />
                <Route path="content" element={<ContentModeration />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
