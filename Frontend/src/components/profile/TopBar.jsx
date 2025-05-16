import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onSearch, onLogout, onCheckout, cartCount, wishlistCount, onWishlist}) => {
  const [searchText, setSearchText] = useState('');
  const { user} = useAuth(); // access user from AuthContext
  const navigate = useNavigate();
  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText);
    }
  };

  return (
    <div className="topbar">
      <h2
        className="logo"
        style={{ cursor: 'pointer' }}
        onClick={() => window.location.href = '/'}
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
              Checkout{cartCount > 0 ? ` (${cartCount})` : ''}
            </button>
          </>
        )}

        {!user ? (
          <>
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/signin')}>Sign In</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={onLogout}>Sign Out</button>
          </>
        )}
      </div>

    </div>
  );
};

export default TopBar;
