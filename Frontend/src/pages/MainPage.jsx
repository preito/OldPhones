import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import PhoneCard from '../components/PhoneCard';
import phoneData from '../data/phonelisting.json';
import userList from '../data/userlist.json';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';

const MainPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, wishlistItems, addToWishlist } = useContext(CartContext);

  const [viewState, setViewState] = useState('home');
  const [previousView, setPreviousView] = useState('home');

  const [isLoggedIn, setIsLoggedIn] = useState({ id: "5f5237a4c1beb1523fa3da02", name: "Test User" });
  const [soldOutPhones, setSoldOutPhones] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [brandFilter, setBrandFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);

  const [tempBrandFilter, setTempBrandFilter] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState(2000);

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [hiddenReviewIds, setHiddenReviewIds] = useState([]);

  const [quantityInput, setQuantityInput] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const userMap = {};
  userList.forEach(user => {
    const id = user._id?.$oid || user._id;
    userMap[id] = user;
  });

  const handleSearch = (query) => {
    const results = phoneData.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setBrandFilter('');
    setMaxPrice(2000);
    setViewState('search');
  };

  const handleLogout = () => setIsLoggedIn(false);

  const handlePhoneClick = (phone) => {
    setSelectedPhone(phone);
    setPreviousView(viewState);
    setViewState('item');
    setQuantityInput('');
    setShowAllReviews(false);
    setHiddenReviewIds([]);
    setNewComment('');
    setNewRating(5);
  };

  const handleAddToCart = () => {
    const quantity = Number(quantityInput);
    if (quantity > 0) {
      addToCart(selectedPhone, quantity); 
      alert("Item added to cart!");
      setQuantityInput('');
    }
  };  
  

  useEffect(() => {
    if (viewState === 'home') {
      const soldOut = phoneData
        .filter(p => !p.disabled && p.stock > 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

      const best = phoneData
        .filter(p => !p.disabled && p.reviews.length >= 2)
        .sort((a, b) => {
          const avgA = a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length;
          const avgB = b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length;
          return avgB - avgA;
        })
        .slice(0, 5);

      setSoldOutPhones(soldOut);
      setBestSellers(best);
    }
  }, [viewState]);

  return (
    <div>
      <TopBar
        viewState={viewState}
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onCheckout={() => navigate('/checkout')}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onWishlist={() => navigate('/wishlist')}
      />

      <div className="content">
        {viewState === 'home' && (
          <div className="main-section">
            <h2>Sold Out Soon</h2>
            <div className="listing-container">
              {soldOutPhones.map(phone => (
                <PhoneCard key={phone._id} phone={phone} userMap={userMap} onClick={handlePhoneClick} />
              ))}
            </div>

            <h2>Best Sellers</h2>
            <div className="listing-container">
              {bestSellers.map(phone => (
                <PhoneCard key={phone._id} phone={phone} userMap={userMap} onClick={handlePhoneClick} />
              ))}
            </div>
          </div>
        )}

        {viewState === 'search' && (
          <div className="main-section">
            <h2>Search Results</h2>
            <div className="filter-bar">
              <label>Filter by Brand: </label>
              <select value={tempBrandFilter} onChange={(e) => setTempBrandFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Nokia">Nokia</option>
              </select>

              <label style={{ marginLeft: '20px' }}>Max Price: </label>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(Number(e.target.value))}
              />
              <span>${tempMaxPrice}</span>

              <button style={{ marginLeft: '20px' }} onClick={() => {
                setBrandFilter(tempBrandFilter);
                setMaxPrice(tempMaxPrice);
              }}>
                Filter
              </button>
            </div>

            <div className="listing-container">
              {searchResults
                .filter(phone =>
                  (brandFilter === '' || phone.brand === brandFilter) &&
                  phone.price <= maxPrice
                )
                .map(phone => (
                  <PhoneCard key={phone._id} phone={phone} userMap={userMap} onClick={handlePhoneClick} />
                ))}
            </div>
          </div>
        )}

        {viewState === 'item' && selectedPhone && (
          <div className="item-details">
            <button onClick={() => setViewState(previousView)}>← Back</button>

            <h2>{selectedPhone.title}</h2>
            <img
              src={`/images/${selectedPhone.brand}.jpeg`}
              alt={selectedPhone.title}
              className="phone-image"
            />
            <p><strong>Brand:</strong> {selectedPhone.brand}</p>
            <p><strong>Stock:</strong> {selectedPhone.stock}</p>
            <p><strong>Price:</strong> ${selectedPhone.price}</p>
            <p>
              <strong>Seller:</strong>{' '}
              {userMap[selectedPhone.seller]?.firstname} {userMap[selectedPhone.seller]?.lastname || 'Unknown Seller'}
            </p>
            <p><strong>In Cart:</strong> {
              cartItems.find(item =>
                `${item.phone.title}_${item.phone.brand}_${item.phone.price}` ===
                `${selectedPhone.title}_${selectedPhone.brand}_${selectedPhone.price}`
              )?.quantity || 0
            }</p>

            <h3>Reviews</h3>
            {selectedPhone.reviews
              .slice(0, showAllReviews ? selectedPhone.reviews.length : 3)
              .map((review, idx) => {
                const isHidden = hiddenReviewIds.includes(idx);
                const isLong = review.comment.length > 200;
                const canHide = isLoggedIn && (
                  isLoggedIn.id === review.reviewer || isLoggedIn.id === selectedPhone.seller
                );

                return (
                  <div
                    key={idx}
                    className={`review-card ${isHidden ? 'hidden-review' : ''}`}
                  >
                    <p><strong>
                      {userMap[review.reviewer]?.firstname} {userMap[review.reviewer]?.lastname || 'Unknown Reviewer'}
                    </strong></p>
                    <p>Rating: {review.rating}</p>

                    {isLong ? (
                      <p>
                        {review.comment.slice(0, 200)}...
                        {!isHidden && (
                          <button onClick={() => alert(review.comment)}>Show full comment</button>
                        )}
                      </p>
                    ) : (
                      <p>{review.comment}</p>
                    )}

                    {canHide && (
                      <button onClick={() => {
                        setHiddenReviewIds(prev =>
                          prev.includes(idx)
                            ? prev.filter(i => i !== idx)
                            : [...prev, idx]
                        );
                      }}>
                        {isHidden ? 'Show' : 'Hide'}
                      </button>
                    )}
                  </div>
                );
              })
            }

            {selectedPhone.reviews.length > 3 && (
              <button onClick={() => setShowAllReviews(prev => !prev)}>
                {showAllReviews ? 'Show Less' : 'Show More Reviews'}
              </button>
            )}

            <div className="cart-wishlist-section">
              <h3>Add to Cart</h3>
              <input
                type="number"
                min="1"
                max={selectedPhone.stock}
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
              />
              <button onClick={handleAddToCart}>Add to Cart</button>

              <h3>Add to Wishlist</h3>
              <button onClick={() => {
                addToWishlist(selectedPhone);
                alert("Item added to wishlist!");
              }}>
                Add to Wishlist
              </button>

              <h3>Leave a Review</h3>
              <textarea
                rows="3"
                cols="50"
                maxLength={500}
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea><br />

              <label>
                Rating:
                <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label><br />

              <button
                onClick={() => {
                  alert('Review submitted (not yet saved)');
                  setNewComment('');
                  setNewRating(5);
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
