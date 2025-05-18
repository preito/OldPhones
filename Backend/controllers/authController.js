const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    let { email } = req.body;

    if (typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email" });
    }
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }

    // Use bcrypt.compare to check hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // attach user to session
    req.session.user = { id: user._id, email: user.email };
    res.json({ message: "Logged in", user: user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.me = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  // re-fetch full user from DB incase details have changed since
  const user = await User.findById(req.session.user.id).select("-password");
  res.json(user);
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    let { email } = req.body;

    // Basic server-side validation (Potential extention needed)
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    email = String(email).trim().toLowerCase();

    // Prevent duplicate accounts
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    //Email Verification
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    // Create & save the user
    const user = new User({
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      email,
      password: hashed,
      verified: false,
      verificationToken: token,
      verificationTokenExpires: expires,
    });
    await user.save();

    const verifyURL = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${user.email}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email address",
      html: `<p>Hi ${user.firstname},</p>
            <p>Please click <a href="${verifyURL}">here</a> to verify your account.</p>`,
    });

    // Respond with the newly created user’s basic info
    return res.status(201).json({
      message: "Account created successfully. Awaiting email verification",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    console.log("verifyEmail called with:", { token, email });

    if (!token || !email) {
      return res.status(400).send("Invalid verification link.");
    }

    // 1) lookup by email only
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No such user for email:", email);
      return res.status(400).send("Invalid verification link.");
    }

    // 2) if already verified, succeed
    if (user.verified) {
      console.log("User already verified:", email);
      return res.send("Email already verified; you can sign in.");
    }

    // 3) now check token & expiry
    const now = new Date();
    if (
      user.verificationToken !== token ||
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < now
    ) {
      console.log("Token mismatch or expired:", {
        tokenStored: user.verificationToken,
        expires: user.verificationTokenExpires,
        now,
      });
      return res.status(400).send("Invalid or expired link.");
    }

    // 4) mark verified
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    console.log("Email verified for:", email);

    return res.send("Email verified! You can now sign in.");
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).send("Server error.");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account with that email." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();

    const resetURL = `${
      process.env.FRONTEND_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetURL}">here</a> to set a new password. This link expires in 1 hour.</p>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email, resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired link." });
    }
    const now = new Date();
    if (!user.resetPasswordExpires || user.resetPasswordExpires < now) {
      return res.status(400).json({ message: "Reset link has expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.json({
      message: "Password has been reset. You can now sign in.",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Auth check
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Fetch user
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //Verify current password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    // Update fields
    user.firstname = firstName;
    user.lastname = lastName;
    user.email = email;
    await user.save();

    // update session email
    req.session.user.email = email;

    // Return success + updated user
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your password has been changed",
      html: `
        <p>Hi ${user.firstname},</p>
        <p>This is a notification that your account password was just changed.</p>
      `,
    });

    return res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
