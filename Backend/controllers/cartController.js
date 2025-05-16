const User = require('../models/User');

// Add or update item in cart
module.exports.addToCart = async (req, res) => {
  const { userId, phoneId, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingItem = user.cart.find(item => item.phone.toString() === phoneId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ phone: phoneId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Item added to cart', cart: user.cart });
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

    user.cart = user.cart.filter(item => item.phone.toString() !== phoneId);
    await user.save();

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
