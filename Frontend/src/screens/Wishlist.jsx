import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { wishlistItems, setWishlistItems, removeFromWishlist, addToCart, clearWishlist } = useContext(CartContext);

  useEffect(() => {
    if (user?._id) {
      fetch(`/api/wishlist/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setWishlistItems(data);
          } else {
            console.error("Wishlist response is not an array:", data);
          }
        })
        .catch(err => console.error('Error loading wishlist:', err));
    }
  }, [user?._id, setWishlistItems]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!user) return <div style={{ padding: '2rem' }}>You must be logged in to view your wishlist.</div>;

  return (
    <div className="wishlist-page">
      <h2>Wishlist</h2>
      <button onClick={() => navigate(-1)}>Back</button>

      {/* Show clear button only when wishlist has items */}
      {wishlistItems.length > 0 && (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to clear your wishlist?")) {
              clearWishlist(user._id);
            }
          }}
          style={{ margin: '10px 0' }}
        >
          Clear Wishlist
        </button>
      )}

      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlistItems.map((item, index) => {
            if (!item || !item.title) return null;

            return (
              <li
                key={index}
                style={{
                  marginBottom: '20px',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '10px',
                }}
              >
                <h4>{item.title}</h4>
                <p>Brand: {item.brand}</p>
                <p>Price: ${item.price}</p>
                <p>Stock: {item.stock}</p>
                <button
                  onClick={() => {
                    if (user?._id) {
                      addToCart(item, 1, user._id);
                      alert('Item added to cart!');
                    }
                  }}
                >
                  Add to Cart
                </button>
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => user?._id && removeFromWishlist(item, user._id)}
                >
                  Remove from Wishlist
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
