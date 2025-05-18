const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// router.post("/admin/login", adminController.adminLogin);
// router.post("/admin/logout", adminController.adminLogout);
// router.get("/admin/me", adminController.checkAdminSession);
router.get('/api/admin/users', adminController.getPaginatedUsers);

router.put("/api/admin/users/:id", adminController.updateUser);

router.delete('/api/admin/users/:id', adminController.deleteUser);

router.patch('/api/admin/users/:id/toggle-disable', adminController.toggleUserDisable);

router.get('/api/admin/phones', adminController.getPaginatedPhones);

router.put("/api/admin/phones/:id", adminController.updatePhone);

router.put("/api/admin/phones/:id/toggle-disable", adminController.togglePhoneDisable);

router.delete("/api/admin/phones/:id", adminController.deletePhone);

router.get("/api/admin/reviews", adminController.getModeratedReviews);

router.patch('/api/admin/phones/:phoneId/reviews/:reviewerId/toggle-hidden', adminController.toggleReviewHidden);

module.exports = router;
