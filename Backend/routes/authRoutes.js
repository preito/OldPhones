
const router = require('express').Router()
const { login, me, logout, register } = require('../controllers/authController')

router.post('/api/auth/login', login)
router.get('/api/auth/me', me)
router.post('/api/auth/logout', logout)
router.post('/api/auth/register', register);

module.exports = router
