const User = require('../models/User');

// Add or update item in cart
module.exports.addToCart = async (req, res) => {
  const { userId, phoneId, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingItem = user.cart.find(item => item.phone.toString() === phoneId);

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      user.cart.push({ phone: phoneId, quantity });
    }

    await user.save();
    const updatedUser = await User.findById(userId).populate('cart.phone');
    res.status(200).json({ message: 'Item added to cart', cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get user’s cart
module.exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('cart.phone');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, phoneId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(item => {
      return item.phone && item.phone.toString() !== phoneId;
    });

    await user.save();
    const updatedUser = await User.findById(userId).populate('cart.phone');
    res.status(200).json({ message: 'Item removed from cart', cart: updatedUser.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateCartQuantity = async (req, res) => {
  const { userId, phoneId, quantity } = req.body;

  if (!userId || !phoneId || quantity < 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const itemIndex = user.cart.findIndex(item => item.phone.toString() === phoneId);

    if (itemIndex === -1) {
      if (quantity > 0) {
        user.cart.push({ phone: phoneId, quantity });
      }
    } else {
      if (quantity === 0) {
        user.cart.splice(itemIndex, 1);
      } else {
        user.cart[itemIndex].quantity = quantity;
      }
    }

    await user.save();
    const updatedUser = await User.findById(userId).populate('cart.phone');
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
