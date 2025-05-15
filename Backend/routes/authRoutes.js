
const router = require('express').Router()
const { login, me, logout, register, verifyEmail } = require('../controllers/authController')

router.post('/api/auth/login', login)
router.get('/api/auth/me', me)
router.post('/api/auth/logout', logout)
router.post('/api/auth/register', register);
router.get('/api/auth/verify-email', verifyEmail);

module.exports = router
