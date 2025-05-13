
const router = require('express').Router()
const { login, me, logout } = require('../controllers/authController')

router.post('/api/auth/login', login)
router.get('/api/auth/me', me)
router.post('/api/auth/logout', logout)

module.exports = router
