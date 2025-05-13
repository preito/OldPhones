import express from 'express';
import Phone from '../models/Phone.js';
import User from '../models/User.js';

const router = express.Router();

// Add a new review to a phone
router.post('/:phoneId/reviews', async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user?._id; // assumes user is authenticated and middleware sets req.user

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  try {
    const phone = await Phone.findById(req.params.phoneId);
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }

    const user = await User.findById(userId).select('firstname lastname');

    const newReview = {
      name: `${user.firstname} ${user.lastname}`,
      rating: Number(rating),
      comment,
      user: userId
    };

    phone.reviews.push(newReview);
    phone.rating = phone.reviews.reduce((acc, r) => acc + r.rating, 0) / phone.reviews.length;

    await phone.save();
    res.status(201).json({ message: 'Review added successfully', reviews: phone.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

// get reviews with reviewer info
router.get('/:phoneId/reviews', async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.phoneId).populate('reviews.user', 'firstname lastname');
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    res.json(phone.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

export default router;
