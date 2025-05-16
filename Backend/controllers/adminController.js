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
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search
      ? {
        $or: [
          { firstname: { $regex: search, $options: "i" } },
          { lastname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({
      data: users,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname, email },
      { new: true } // return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.toggleUserDisable = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle disable state
    if (user.disabled) {
      user.disabled = undefined; // Remove field to enable user
    } else {
      user.disabled = true; // Disable user
    }

    await user.save();

    res.json({
      message: `User has been ${user.disabled ? 'disabled' : 'enabled'}`,
      user,
    });
  } catch (error) {
    console.error('Error toggling user disable:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
