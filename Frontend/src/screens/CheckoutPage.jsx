import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, fetchCart } = useContext(CartContext);

  useEffect(() => {
    if (user) {
      fetchCart(user._id);
    }
  }, [fetchCart, user]);

  const handleQuantityChange = async (phone, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    if (user) {
      await updateQuantity(phone, quantity, user._id);
      await fetchCart(user._id); 
    }
  };

  const handleConfirm = async () => {
    try {
      for (const item of cartItems) {
        if (!item.phone || !item.phone._id) {
          console.warn("Skipping cart item due to missing phone info:", item);
          continue;
        }

        await fetch(`/api/phone/${item.phone._id}/reduceStock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: item.quantity,
            userId: user._id
          }),
        });
      }
      
    const total = cartItems.reduce((sum, item) => {
      if (!item.phone || typeof item.phone.price !== 'number') return sum;
      return sum + item.phone.price * item.quantity;
    }, 0);

    await fetch('/api/user/save-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        items: cartItems.map(item => ({
          phoneId: item.phone._id,
          quantity: item.quantity
        })),
        total
      })
    });

      alert('Transaction confirmed!');
      await clearCart(user._id);
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Something went wrong during checkout.');
    }
  };



  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.phone || typeof item.phone.price !== 'number') return sum;
    return sum + item.phone.price * item.quantity;
  }, 0);


  // Loading or unauthenticated guard
  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: '2rem' }}>You must be logged in to view this page.</div>;
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <button onClick={() => navigate(-1)}>Back</button>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => {
              if (!item.phone) return null; // Skip broken entries

              return (
                <li key={item.phone._id}>
                  <h4>{item.phone.title}</h4>
                  <p>Price: ${item.phone.price}</p>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.phone, e.target.value)}
                      style={{ marginLeft: '10px', width: '60px' }}
                    />
                  </label>
                  <button onClick={() => removeFromCart(item.phone, user._id)}>Remove</button>
                </li>
              );
            })}
          </ul>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear the cart?")) {
                clearCart(user._id);
              }
            }}
            style={{ marginRight: '10px' }}
          >
            Clear Cart
          </button>
          <button onClick={handleConfirm}>Confirm Transaction</button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
