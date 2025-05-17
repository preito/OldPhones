import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

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

      toast.success('Transaction confirmed!');
      await clearCart(user._id);
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Something went wrong during checkout.');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.phone || typeof item.phone.price !== 'number') return sum;
    return sum + item.phone.price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-zinc-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-zinc-100">
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-zinc-100 text-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-700 hover:underline"
        >
          ← Back
        </button>

        {cartItems.length === 0 ? (
          <p className="text-zinc-900">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((item) => {
                if (!item.phone) return null;

                return (
                  <li
                    key={item.phone._id}
                    className="bg-slate-700 p-4 rounded-lg shadow text-white hover:scale-105 transform transition-transform duration-300"
                  >
                    <h4 className="text-lg font-semibold">{item.phone.title}</h4>
                    <p className="text-sm text-zinc-200">Price: ${item.phone.price}</p>
                    <div className="flex items-center mt-2">
                      <label className="mr-2">Quantity:</label>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.phone, e.target.value)}
                        className="bg-zinc-300 border border-zinc-900 text-black px-2 py-1 rounded w-20"
                      />
                    </div>
                    <button
                      onClick={() => removeFromCart(item.phone, user._id)}
                      className="mt-2 text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>

            <h3 className="text-xl font-semibold mt-6">
              Total Price: ${totalPrice.toFixed(2)}
            </h3>

            <div className="mt-4 space-x-4">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear the cart?")) {
                    clearCart(user._id);
                  }
                }}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Cart
              </button>
              <button
                onClick={handleConfirm}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm Transaction
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
