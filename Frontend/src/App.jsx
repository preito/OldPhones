import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./screens/Profile";
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import MainPage from "./screens/MainPage";
import CheckoutPage from "./screens/CheckoutPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Wishlist from "./screens/Wishlist";
import EmailSent from "./screens/auth/EmailSent";
import VerifyEmail from "./screens/auth/VerifyEmail";
import ForgotPassword from "./screens/auth/ForgotPassword";
import ResetPassword from "./screens/auth/ResetPassword";
import ProtectedRoute from './components/protectedRoutes/ProtectedProfileRoute';
import Admin from "./screens/Admin";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/email-sent" element={<EmailSent />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
