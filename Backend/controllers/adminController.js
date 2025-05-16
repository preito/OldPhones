const User = require('../models/User');
const bcrypt = require("bcrypt");

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
// const ADMIN_HASHED_PASSWORD = process.env.ADMIN_HASHED_PASSWORD;

// exports.adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   if (email !== ADMIN_EMAIL) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const match = await bcrypt.compare(password, ADMIN_HASHED_PASSWORD);
//   if (!match) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   req.session.admin = true;
//   req.session.cookie.maxAge = 15 * 60 * 1000; // 15 minutes
//   res.status(200).json({ message: "Admin logged in successfully" });
// };

// exports.adminLogout = (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("connect.sid");
//     res.status(200).json({ message: "Logged out" });
//   });
// };

// exports.checkAdminSession = (req, res) => {
//   if (req.session.admin) {
//     res.status(200).json({ admin: true });
//   } else {
//     res.status(401).json({ admin: false });
//   }
// };

exports.getPaginatedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // min 10 max 50
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit), // exclude passwords
      User.countDocuments()
    ]);
    res.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    });
  } catch (err) {
    console.error("User pagination error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
