const User = require('../models/User');


// module.exports.checkUserCredentials = async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({ error: 'Email query param is required' });
//     }

//     const user = await User.findOne({ email });

//     if (user) {
//       return res.json({ exists: true, userId: user._id });
//     } else {
//       return res.json({ exists: false });
//     }
//   } catch (error) {
//     console.error("Error checking user:", error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

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