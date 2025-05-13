import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

// POST /api/wishlist → Add phone to wishlist
router.post('/', addToWishlist);

// GET /api/wishlist/:userId → Get user's wishlist
router.get('/:userId', getWishlist);

router.delete('/', removeFromWishlist);

export default router;
