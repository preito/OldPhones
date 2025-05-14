var express = require('express');
var controller = require('../controllers/controller');
const phoneController= require('../controllers/phoneController');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const wishlistController = require('../controllers/wishlistController');

var router = express.Router();

router.get('/api', controller.test)
router.get('/api/phone', phoneController.getPhones);
router.post('/api/user/check-credentials', userController.checkUserByCredentials);

// GET /api/phones → Get all phones
router.get('/api/phone/getPhoneSeller', phoneController.getPhoneSeller);

// GET /api/phones/:id → Get a single phone by ID
router.get('/api/phone/:id', phoneController.getPhoneById);

// GET /api/users → Get all users
router.get('/api/user', userController.getUsers);

// GET /api/users/:id → Get a single user by ID
router.get('/:id', userController.getUserById);

// POST /api/cart → Add item to cart
router.post('/api/cart', cartController.addToCart);

// GET /api/cart/:userId → Get user cart
router.get('/api/cart/:userId', cartController.getCart);

// DELETE /api/cart → Remove item from cart
router.delete('/api/cart', cartController.removeFromCart);

// POST /api/wishlist → Add phone to wishlist
router.post('/api/wishlist', wishlistController.addToWishlist);

// GET /api/wishlist/:userId → Get user's wishlist
router.get('/api/wishlist/:userId', wishlistController.getWishlist);

router.delete('/api/wishlist', wishlistController.removeFromWishlist);

module.exports = router;