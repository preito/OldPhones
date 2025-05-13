import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

// POST /api/cart → Add item to cart
router.post('/', addToCart);

// GET /api/cart/:userId → Get user cart
router.get('/:userId', getCart);

// DELETE /api/cart → Remove item from cart
router.delete('/', removeFromCart);

export default router;
