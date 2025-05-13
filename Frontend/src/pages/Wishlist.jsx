import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart } = useContext(CartContext);

  return (
    <div className="wishlist-page">
      <h2>Wishlist</h2>
      <button onClick={() => navigate(-1)}>Back</button>

      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlistItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '20px' }}>
              <h4>{item.title}</h4>
              <p>Brand: {item.brand}</p>
              <p>Price: ${item.price}</p>
              <p>Stock: {item.stock}</p>
              <button
                onClick={() => {
                  addToCart(item, 1);
                  alert("Item added to cart!");
                }}
              >
                Add to Cart
              </button>
              <button onClick={() => removeFromWishlist(item)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
