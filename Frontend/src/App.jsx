import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./screens/Profile";
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import MainPage from "./screens/MainPage";
import CheckoutPage from "./screens/CheckoutPage";
import { CartProvider } from "./components/profile/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Wishlist from "./screens/Wishlist";
import EmailSent from "./screens/auth/EmailSent";
import VerifyEmail from "./screens/auth/VerifyEmail";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<MainPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/email-sent" element={<EmailSent />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
