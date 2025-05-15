const bcrypt = require("bcrypt");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_HASHED_PASSWORD = process.env.ADMIN_HASHED_PASSWORD;

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, ADMIN_HASHED_PASSWORD);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.admin = true;
  req.session.cookie.maxAge = 15 * 60 * 1000; // 15 minutes
  res.status(200).json({ message: "Admin logged in successfully" });
};

exports.adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

exports.checkAdminSession = (req, res) => {
  if (req.session.admin) {
    res.status(200).json({ admin: true });
  } else {
    res.status(401).json({ admin: false });
  }
};
