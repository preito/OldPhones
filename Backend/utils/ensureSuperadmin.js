const User = require("../models/User");
const bcrypt = require("bcrypt");

async function ensureSuperAdmin() {
  try {
    const existing = await User.findOne({ sadmin: true });
    if (!existing) {
      const hashed = await bcrypt.hash("Admin@1234", 10);
      const admin = new User({
        firstname: "Super",
        lastname: "Admin",
        email: "admin@oldphonedeals.com",
        password: hashed,
        sadmin: true,
      });
      await admin.save();
      console.log("Super admin account created.");
    } else {
      console.log("Super admin already exists.");
    }
  } catch (err) {
    console.error("Failed to create super admin:", err);
  }
}

module.exports = ensureSuperAdmin;
