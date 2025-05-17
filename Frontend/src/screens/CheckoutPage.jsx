import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, fetchCart } = useContext(CartContext);

  useEffect(() => {
    if (user) {
      fetchCart(user._id);
    }
  }, [fetchCart, user]);

  const handleQuantityChange = (phone, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    if (user) updateQuantity(phone, quantity, user._id);
  };

  const handleConfirm = async () => {
    try {
      // Loop through all items in cart and send stock reduction request
      for (const item of cartItems) {
        await fetch(`/api/phone/${item.phone._id}/reduceStock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: item.quantity,
            userId: user._id
          }),
        });
      }

      alert('Transaction confirmed!');
      await clearCart(user._id);
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Something went wrong during checkout.');
    }
  };


  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.phone.price * item.quantity,
    0
  );

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
            {cartItems.map((item) => (
              <li key={getPhoneKey(item.phone)} style={{ marginBottom: '20px' }}>
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
            ))}
          </ul>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handleConfirm}>Confirm Transaction</button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
