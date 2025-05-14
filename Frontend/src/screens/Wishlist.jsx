import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/profile/CartContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, setWishlistItems, removeFromWishlist, addToCart } = useContext(CartContext);
  const isLoggedIn = { id: "5f5237a4c1beb1523fa3da02", name: "Test User" }; // Replace with real auth later

  useEffect(() => {
    fetch(`/api/wishlist/${isLoggedIn.id}`)
      .then(res => res.json())
      .then(data => {
        setWishlistItems(data);
      })
      .catch(err => console.error('Error loading wishlist:', err));
  }, [isLoggedIn.id, setWishlistItems]);
  
  return (
    <div className="wishlist-page">
      <h2>Wishlist</h2>
      <button onClick={() => navigate(-1)}>Back</button>

      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlistItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <h4>{item.title}</h4>
              <p>Brand: {item.brand}</p>
              <p>Price: ${item.price}</p>
              <p>Stock: {item.stock}</p>
              <button
                onClick={() => {
                  addToCart(item, 1, isLoggedIn.id);
                  alert("Item added to cart!");
                }}
              >
                Add to Cart
              </button>
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => removeFromWishlist(item, isLoggedIn.id)}
              >
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
