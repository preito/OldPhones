import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SignOutModal from "../../components/auth/SignOutModal";

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
      <div className="topbar">
        <h2
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = "/")}
        >
          OldPhoneDeals
        </h2>

        <div className="search-group">
          <input
            type="text"
            aria-label="Search phone titles"
            placeholder="Search phone title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="button-group">
          {user && (
            <>
              <button onClick={onWishlist}>
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </button>
              <button onClick={onCheckout}>
                Checkout{cartCount > 0 ? ` (${cartCount})` : ""}
              </button>
            </>
          )}

          {!user ? (
            <>
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={() => navigate("/signin")}>Sign In</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/profile")}>Profile</button>
              {/* open modal instead of immediate logout */}
              <button onClick={openSignOut}>Sign Out</button>
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
