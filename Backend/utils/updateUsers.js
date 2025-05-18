const bcrypt = require("bcrypt");
const User = require("../models/User");

const updateUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash("User@1234", 10);

    const result = await User.updateMany(
      { sadmin: { $ne: true } }, // Skip admin users
      {
        $set: {
          verified: true,
          password: hashedPassword,
          createdAt: new Date("2025-05-18T00:00:00Z")
        },
      }
    );

    console.log(`${result.modifiedCount} users updated.`);
  } catch (err) {
    console.error("Error updating users:", err);
  }
};

module.exports = updateUsers;
