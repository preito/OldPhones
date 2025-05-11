import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;
  const addToCart = (phone, quantity) => {
    setCartItems(prev => {
      const key = getPhoneKey(phone);
      const existing = prev.find(item => getPhoneKey(item.phone) === key);
  
      if (existing) {
        return prev.map(item =>
          getPhoneKey(item.phone) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
  
      return [...prev, { phone, quantity }];
    });
  };

  const [wishlistItems, setWishlistItems] = useState([]);
  const addToWishlist = (phone) => {
    const key = getPhoneKey(phone);
    setWishlistItems(prev =>
      prev.some(item => getPhoneKey(item) === key)
        ? prev
        : [...prev, phone]
    );
  };

  const removeFromWishlist = (phone) => {
    const key = getPhoneKey(phone);
    setWishlistItems(prev => prev.filter(item => getPhoneKey(item) !== key));
  };

  const updateQuantity = (phoneToUpdate, quantity) => {
    const keyToUpdate = getPhoneKey(phoneToUpdate);
    
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => getPhoneKey(item.phone) !== keyToUpdate));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          getPhoneKey(item.phone) === keyToUpdate ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (phoneToRemove) => {
    const keyToRemove = getPhoneKey(phoneToRemove);
    setCartItems(prev => prev.filter(item => getPhoneKey(item.phone) !== keyToRemove));
  };

  const clearCart = () => {
    setCartItems([]);
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
      removeFromWishlist
    }}>
      {children}
    </CartContext.Provider>
  );

};
