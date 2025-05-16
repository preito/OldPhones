const router = require("express").Router();
const {
  login,
  me,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

router.post("/api/auth/login", login);
router.get("/api/auth/me", me);
router.post("/api/auth/logout", logout);
router.post("/api/auth/register", register);
router.get("/api/auth/verify-email", verifyEmail);
router.post("/api/auth/forgot-password", forgotPassword);
router.post("/api/auth/reset-password", resetPassword);
router.put("/api/auth/update-profile", updateProfile);
router.post("/api/auth/change-password", changePassword);

module.exports = router;
