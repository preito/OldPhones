import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SignOutModal from "../../components/auth/SignOutModal";
import { Home } from "lucide-react";

const TopBar = ({
  onSearch,
  onLogout,
  onCheckout,
  cartCount,
  wishlistCount,
  onWishlist,
}) => {
  const [searchText, setSearchText] = useState("");
  const [isSignOutOpen, setSignOutOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) onSearch(searchText);
  };

  const openSignOut = () => setSignOutOpen(true);
  const closeSignOut = () => setSignOutOpen(false);
  const confirmSignOut = () => {
    onLogout();
    setSignOutOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-gray-900 text-white px-6 py-4 shadow-md space-x-6">
        {/* Left: Logo + Home */}
        <div className="flex items-center space-x-4">
          <h2
            className="text-zinc-100 text-2xl font-bold cursor-pointer hover:text-blue-400"
            onClick={() => (window.location.href = "/")}
          >
            OldPhoneDeals
          </h2>
          <button
            onClick={() => (window.location.href = "/")}
            className="text-zinc-100 hover:text-blue-300 transition"
            aria-label="Go to home"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Search */}
        <div className="flex items-center space-x-2 w-full max-w-md">
          <input
            type="text"
            aria-label="Search phone titles"
            placeholder="Search phone title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-3 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          {user && (
            <>
              <button
                onClick={onWishlist}
                className="hover:text-blue-300 transition"
              >
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </button>
              <button
                onClick={onCheckout}
                className="hover:text-blue-300 transition"
              >
                Checkout{cartCount > 0 ? ` (${cartCount})` : ""}
              </button>
            </>
          )}

          {!user ? (
            <button
              onClick={() => navigate("/signin")}
              className="hover:text-blue-300 transition"
            >
              Sign In
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="hover:text-blue-300 transition"
              >
                Profile
              </button>
              <button
                onClick={openSignOut}
                className="hover:text-red-400 transition"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={isSignOutOpen}
        onConfirm={confirmSignOut}
        onCancel={closeSignOut}
      />
    </>
  );
};

export default TopBar;
