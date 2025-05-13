const User = require('../models/User')

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'User not found' })
  const match = password === user.password // or bcrypt.compare
  if (!match) return res.status(401).json({ message: 'Invalid password' })

  // attach user to session
  req.session.user = { id: user._id, email: user.email }
  res.json({ message: 'Logged in' })
  
}

// GET /api/auth/me
exports.me = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  // optional: re-fetch full user from DB incase details have changed since
  const user = await User.findById(req.session.user.id).select('-password')
  res.json(user)
}

// POST /api/auth/logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' })
    res.clearCookie('connect.sid')
    res.json({ message: 'Logged out' })
  })
}
