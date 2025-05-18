import React, { createContext, useState } from 'react';
// import User from '../../../Backend/models/User';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;
  const addToCart = async (phone, quantity, userId) => {
    try {
      const res = await fetch(`api/cart`, {
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
      const res = await fetch(`api/cart/${userId}`);
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
      const res = await fetch(`api/wishlist`, {
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
      const res = await fetch(`api/wishlist`, {
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
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneId: phone._id, quantity })
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data); // backend returns full updated cart
      } else {
        console.error('Failed to update cart quantity:', data.message);
      }
    } catch (err) {
      console.error('Cart quantity update error:', err);
    }
  };


  const removeFromCart = async (phone, userId) => {
    try {
      const res = await fetch(`api/cart/${userId}/${phone._id}`, {
        method: 'DELETE',
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
      if (item.phone && item.phone._id) {
        await removeFromCart(item.phone, userId);
      }
    }
  };
  const fetchWishlist = async (userId) => {
    try {
      const res = await fetch(`/api/wishlist/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setWishlistItems(data);
      } else {
        console.error('Failed to fetch wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };
  
  const clearWishlist = async (userId) => {
    for (const item of wishlistItems) {
      if (item && item._id) {
        await removeFromWishlist(item, userId);
      }
    }
    setWishlistItems([]); // optional: force-clear state
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
      clearWishlist,
      fetchCart,
      fetchWishlist
    }}>
      {children}
    </CartContext.Provider>
  );

};
