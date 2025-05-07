import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';

const getPhoneKey = (phone) => `${phone.title}_${phone.brand}_${phone.price}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const handleQuantityChange = (phone, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    updateQuantity(phone, quantity);
  };

  const handleConfirm = () => {
    alert('Transaction confirmed!');
    clearCart();
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
                <button onClick={() => removeFromCart(item.phone)}>Remove</button>
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
