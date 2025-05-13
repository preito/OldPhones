import React, { createContext, useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE;
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;
  const addToCart = async (phone, quantity, userId) => {
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          phoneId: phone._id,
          quantity
        })
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart); // Update local cart with backend response
      } else {
        console.error('Failed to add to cart:', data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const fetchCart = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/cart/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        console.error('Failed to fetch cart:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const [wishlistItems, setWishlistItems] = useState([]);
  const addToWishlist = async (phone, userId) => {
    const key = getPhoneKey(phone);
    
    // Prevent duplicate in local state
    const alreadyInWishlist = wishlistItems.some(item => getPhoneKey(item) === key);
    if (alreadyInWishlist) return;

    try {
      const res = await fetch(`${API_BASE}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          phoneId: phone._id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setWishlistItems(data.wishlist); // backend returns updated wishlist
      } else {
        console.error('Failed to add to wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (phone, userId) => {
    
    try {
      const res = await fetch(`${API_BASE}/wishlist`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneId: phone._id })
      });

      const data = await res.json();
      if (res.ok) {
        setWishlistItems(data.wishlist); // update local state with response
      } else {
        console.error('Failed to remove from wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const updateQuantity = async (phone, quantity, userId) => {
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneId: phone._id, quantity })
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart);
      } else {
        console.error('Failed to update quantity:', data.message);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (phone, userId) => {
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneId: phone._id })
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart);
      } else {
        console.error('Failed to remove from cart:', data.message);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async (userId) => {
    for (const item of cartItems) {
      await removeFromCart(item.phone, userId);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      setWishlistItems,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );

};
