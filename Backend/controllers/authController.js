const User = require("../models/User");
const bcrypt = require("bcrypt");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Use bcrypt.compare to check hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // attach user to session
    req.session.user = { id: user._id, email: user.email };
    res.json({ message: "Logged in" });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  // optional: re-fetch full user from DB incase details have changed since
  const user = await User.findById(req.session.user.id).select("-password");
  res.json(user);
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic server-side validation (Potential extention needed)
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prevent duplicate accounts
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create & save the user
    const user = new User({
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashed,
      verified: false,
    });
    await user.save();

    // Respond with the newly created user’s basic info
    return res.status(201).json({
      message: "Account created successfully.",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
