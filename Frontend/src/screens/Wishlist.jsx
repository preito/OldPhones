import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { wishlistItems, setWishlistItems, removeFromWishlist, addToCart, clearWishlist } = useContext(CartContext);

  useEffect(() => {
    if (user?._id) {
      fetch(`/api/wishlist/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setWishlistItems(data);
          } else {
            console.error("Wishlist response is not an array:", data);
          }
        })
        .catch(err => console.error('Error loading wishlist:', err));
    }
  }, [user?._id, setWishlistItems]);

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
        <p>You must be logged in to view your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-zinc-100 text-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Wishlist</h2>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-700 hover:underline"
          >
            ← Back
          </button>

          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your wishlist?")) {
                  clearWishlist(user._id);
                  toast.info('Wishlist cleared.');
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <p className="text-zinc-800">Your wishlist is empty.</p>
        ) : (
          <ul className="space-y-4">
            {wishlistItems.map((item, index) => {
              if (!item || !item.title) return null;

              return (
                <li
                  key={index}
                  className="bg-slate-700 p-4 rounded-lg shadow text-white hover:scale-105 transform transition-transform duration-300"
                >
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-sm text-zinc-200">Brand: {item.brand}</p>
                  <p className="text-sm text-zinc-200">Price: ${item.price}</p>
                  <p className="text-sm text-zinc-200">Stock: {item.stock}</p>
                  <div className="mt-3 space-x-3">
                    <button
                      onClick={() => {
                        if (user?._id) {
                          addToCart(item, 1, user._id);
                          toast.success('Item added to cart!');
                        }
                      }}
                      className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => user?._id && removeFromWishlist(item, user._id)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
