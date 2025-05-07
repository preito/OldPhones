import React, { useState } from 'react';

const TopBar = ({ isLoggedIn, onSearch, onLogout, onCheckout, cartCount }) => {
  const [searchText, setSearchText] = useState('');

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
        <button onClick={onCheckout}>
          Checkout{cartCount > 0 ? ` (${cartCount})` : ''}
        </button>
        {!isLoggedIn ? (
          <button>Sign In</button>
        ) : (
          <>
            <button>Profile</button>
            <button onClick={onLogout}>Sign Out</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
