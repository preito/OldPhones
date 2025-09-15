import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/profile/TopBar';
import PhoneCard from '../components/profile/PhoneCard';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as phoneApi from "../api/phoneApi";
import { toast } from 'react-toastify';

const MainPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, wishlistItems, addToWishlist, fetchCart, fetchWishlist } = useContext(CartContext);
  const { user, logout, loading } = useAuth();
  const [viewState, setViewState] = useState('home');
  const [previousView, setPreviousView] = useState('home');
  const [soldOutPhones, setSoldOutPhones] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [maxPriceCap, setMaxPriceCap] = useState(2000);
  const [tempBrandFilter, setTempBrandFilter] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState(2000);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);
  const [quantityInput, setQuantityInput] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [filterTrigger, setFilterTrigger] = useState(false);

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setPage(1);
    setViewState('search');
  };


  const handleLogout = () => logout();

  const handlePhoneClick = (phone) => {
    setSelectedPhone(phone);
    setPreviousView(viewState);
    setViewState('item');
    setQuantityInput('');
    setVisibleReviewCount(3);
    setNewComment('');
    setNewRating(5);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const quantity = Number(quantityInput);
    if (quantity <= 0) {
      toast.info("Please enter a valid quantity.");
      return;
    }

    const existingCartItem = cartItems.find(item =>
      `${item.phone.title}_${item.phone.brand}_${item.phone.price}` ===
      `${selectedPhone.title}_${selectedPhone.brand}_${selectedPhone.price}`
    );

    const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const totalDesired = existingQuantity + quantity;

    if (totalDesired > selectedPhone.stock) {
      toast.error("Not enough stock.");
      return;
    }

    await addToCart(selectedPhone, quantity, user._id);
    await fetchCart(user._id);
    toast.success("Item added to cart!");
    setQuantityInput('');
  };

  const handleToggleReview = async (phoneId, review) => {
    try {
      const res = await phoneApi.toggleOwnReviewHidden(phoneId, review._id, !review.hidden);
      const updatedReview = res.data.review;

      setSelectedPhone((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r._id === review._id ? updatedReview : r
        ),
      }));
    } catch (err) {
      console.error("Could not toggle review:", err);
      toast.error("Failed to update review visibility.");
    }
  };

  useEffect(() => {
    if (viewState === 'home' || viewState === 'search') {
      fetch(`${import.meta.env.VITE_API_URL || '/api'}/phones`)
        .then(res => res.json())
        .then(data => {
          setMaxPriceCap(Math.ceil(Math.max(...data.map(p => p.price || 0))));
          setTempMaxPrice(Math.ceil(Math.max(...data.map(p => p.price || 0)))); 
          if (viewState === 'home') {
            const soldOut = data
              .filter(p => !p.disabled && p.stock > 0)
              .sort((a, b) => a.stock - b.stock)
              .slice(0, 5);

            const best = data
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
        })
        .catch(err => console.error('Error fetching phones:', err));
    }
  }, [viewState]);
  useEffect(() => {
    if (user && user._id) {
      fetchCart(user._id);
      fetchWishlist(user._id);
    }
  }, [fetchCart, fetchWishlist, user]);

  useEffect(() => {
    if (viewState === 'search') {
      const fetchPaginatedPhones = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || '/api'}/admin/phones?page=${page}&limit=9&search=${searchTerm}&brand=${brandFilter}&maxPrice=${maxPrice}`
          );
          const data = await response.json();
          setSearchResults(data.data);         
          setTotalPages(data.meta.pages);
        } catch (err) {
          toast.error("Failed to fetch phones.");
          console.error(err);
        }
      };

      fetchPaginatedPhones();
    }
  }, [searchTerm, brandFilter, maxPrice, page, viewState, filterTrigger]);




  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-100 text-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 text-black min-h-screen">
      <TopBar
        viewState={viewState}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onCheckout={() => navigate('/checkout')}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onWishlist={() => navigate('/wishlist')}
      />

      <div className="px-6 py-4">
        {viewState === 'home' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Sold Out Soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {soldOutPhones.map(phone => (
                <PhoneCard key={phone._id} phone={phone} onClick={handlePhoneClick} />
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-4">Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bestSellers.map(phone => (
                <PhoneCard key={phone._id} phone={phone} onClick={handlePhoneClick} />
              ))}
            </div>
          </div>
        )}

        {viewState === 'search' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <label className="text-sm">Brand:</label>
              <select
                value={tempBrandFilter}
                onChange={(e) => setTempBrandFilter(e.target.value)}
                className="bg-zinc-200 border border-zinc-600 px-2 py-1 rounded text-black"
              >
                <option value="">All</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Nokia">Nokia</option>
                <option value="Huawei">Huawei</option>
                <option value="LG">LG</option>
                <option value="Motorola">Motorola</option>
                <option value="HTC">HTC</option>
              </select>

              <label className="text-sm ml-4">
                Max Price: ${tempMaxPrice} / ${maxPriceCap}
              </label>
              <input
                type="range"
                min="0"
                max={maxPriceCap}
                step="25"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(Number(e.target.value))}
              />
              <button
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                onClick={() => {
                  setBrandFilter(tempBrandFilter);
                  setMaxPrice(tempMaxPrice);
                  setPage(1); 
                  setFilterTrigger(prev => !prev);
                }}
              >
                Filter
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map(phone => (
                <PhoneCard key={phone._id} phone={phone} onClick={handlePhoneClick} />
              ))}
            </div>

            {searchResults.length > 0 && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="font-semibold text-lg">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {viewState === 'item' && selectedPhone && (
          <div className="mt-6">
            <button onClick={() => setViewState(previousView)} className="text-blue-700 underline mb-4">← Back</button>

            <h2 className="text-2xl font-bold mb-2">{selectedPhone.title}</h2>
            <img
              src={`${import.meta.env.VITE_API_URL || '/api'}/phone/image/name/${encodeURIComponent(selectedPhone.brand)}.jpeg`}
              alt={selectedPhone.title}
              className="w-full max-w-xs mb-4 rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-phone.jpeg'; // Use your default fallback image path
              }}
            />

            <p><strong>Brand:</strong> {selectedPhone.brand}</p>
            <p><strong>Stock:</strong> {selectedPhone.stock}</p>
            <p><strong>Price:</strong> ${selectedPhone.price}</p>
            <p><strong>Seller:</strong> {selectedPhone.seller?.firstname} {selectedPhone.seller?.lastname || 'Unknown Seller'}</p>
            

            <h3 className="mt-6 text-xl font-semibold">Reviews</h3>
            {selectedPhone.reviews
              .slice(0, visibleReviewCount)
              .map((review, idx) => {
                const isLong = review.comment.length > 200;
                const canHide = user?._id === review.reviewer?._id || user?._id === selectedPhone.seller?._id;

                return (
                  <div key={idx} className={`bg-zinc-300 p-4 rounded my-2 ${review.hidden ? 'opacity-50' : ''}`}>
                    <p className="font-semibold">{review.reviewer?.firstname} {review.reviewer?.lastname || 'Unknown Reviewer'}</p>
                    <p>Rating: {review.rating}</p>
                    <p>
                      {isLong ? `${review.comment.slice(0, 200)}...` : review.comment}
                      {isLong && !review.hidden && (
                        <button onClick={() => toast.info(review.comment)} className="text-blue-700 ml-2 underline">Show full</button>
                      )}
                    </p>
                    {canHide && (
                      <button
                        onClick={() => handleToggleReview(selectedPhone._id, review)}
                        className="text-red-800 mt-2 block underline"
                      >
                        {review.hidden ? 'Show' : 'Hide'}
                      </button>
                    )}
                  </div>
                );
              })}

            {selectedPhone.reviews.length > 3 && (
              <div className="mt-2 space-x-4">
                {visibleReviewCount < selectedPhone.reviews.length ? (
                  <button
                    onClick={() => setVisibleReviewCount(prev => prev + 3)}
                    className="text-blue-700 underline"
                  >
                    Show More Reviews
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setVisibleReviewCount(3);
                      setTimeout(() => {
                        const el = document.getElementById('reviews-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-blue-700 underline"
                  >
                    Show Less Reviews
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Add to Cart</h3>
                <p><strong>In Cart:</strong> {
                  cartItems.find(item =>
                    `${item.phone.title}_${item.phone.brand}_${item.phone.price}` ===
                    `${selectedPhone.title}_${selectedPhone.brand}_${selectedPhone.price}`
                  )?.quantity || 0
                }</p>
                <input
                  type="number"
                  min="1"
                  max={selectedPhone.stock}
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  className="px-3 py-1 rounded bg-zinc-300 text-black border border-zinc-900 mr-2"
                />
                <button
                  onClick={handleAddToCart}
                  className="bg-green-500 px-3 py-1 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Add to Wishlist</h3>
                <button
                  onClick={() => {
                    if (!user) {
                      toast.info("Please sign in to add items to your wishlist.");
                      return;
                    }
                    addToWishlist(selectedPhone, user._id);
                    toast.success("Item added to wishlist!");
                  }}
                  className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Add to Wishlist
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Leave a Review</h3>
                <textarea
                  rows="3"
                  maxLength={500}
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-300 text-black border border-gray-900 rounded"
                ></textarea>

                <label className="block mt-2">
                  Rating:
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="ml-2 px-2 py-1 bg-zinc-300 border border-zinc-900 text-black rounded"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>

                <button
                  onClick={async () => {
                    if (!user) {
                      toast.info("Please sign in to submit a review.");
                      return;
                    }

                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/phone/${selectedPhone._id}/reviews`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          rating: newRating,
                          comment: newComment
                        })
                      });

                      if (response.ok) {
                        const data = await response.json();
                        setSelectedPhone(prev => ({
                          ...prev,
                          reviews: data.reviews,
                          rating: data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length,
                        }));
                        toast.success("Review submitted!");
                        setNewComment('');
                        setNewRating(5);
                      } else {
                        const errorData = await response.json();
                        toast.error(errorData.message || 'Failed to submit review.');
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error('Error submitting review.');
                    }
                  }}
                  className="mt-3 bg-blue-400 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
