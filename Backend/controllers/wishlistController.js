import User from '../models/User.js';
import Phone from '../models/Phone.js';

// Add phone to user's wishlist
export const addToWishlist = async (req, res) => {
  const { userId, phoneId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist.includes(phoneId)) {
      user.wishlist.push(phoneId);
      await user.save();
    }

    const updatedUser = await User.findById(userId).populate('wishlist');
    res.status(200).json({ message: 'Phone added to wishlist', wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Remove phone from user's wishlist
export const removeFromWishlist = async (req, res) => {
  const { userId, phoneId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter(id => id.toString() !== phoneId);
    await user.save();

    const updatedUser = await User.findById(userId).populate('wishlist');
    res.status(200).json({ message: 'Phone removed from wishlist', wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

