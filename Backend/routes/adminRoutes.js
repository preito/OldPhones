const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// router.post("/admin/login", adminController.adminLogin);
// router.post("/admin/logout", adminController.adminLogout);
// router.get("/admin/me", adminController.checkAdminSession);
router.get('/users', adminController.getPaginatedUsers);

module.exports = router;
