const User = require('../models/User');

exports.checkUserByCredentials = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ exists: false, message: 'User not found' });
    }

    // Here you’d typically compare the password with bcrypt
    // For now we'll just echo match
    if (user.password === password) {
      console.log("all good");
      return res.json({ exists: true, match: true, userId: user._id });
    } else {
      console.log("wrong pass");
      return res.json({ exists: true, match: false });
    }

  } catch (err) {
    console.error("Error checking credentials:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (for now)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
