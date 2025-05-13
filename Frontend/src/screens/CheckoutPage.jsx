import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/profile/CartContext';

const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, fetchCart } = useContext(CartContext);
  const isLoggedIn = { id: "5f5237a4c1beb1523fa3da02", name: "Test User" }; // temp

  useEffect(() => {
    fetchCart(isLoggedIn.id);
  }, [fetchCart, isLoggedIn.id]);
  const handleQuantityChange = (phone, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    updateQuantity(phone, quantity, isLoggedIn.id);
  };

  const handleConfirm = async () => {
    alert('Transaction confirmed!');
    await clearCart(isLoggedIn.id);
    navigate('/');
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.phone.price * item.quantity,
    0
  );

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
                <button onClick={() => removeFromCart(item.phone, isLoggedIn.id)}>Remove</button>
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
