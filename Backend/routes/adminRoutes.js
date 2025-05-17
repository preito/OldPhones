const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// router.post("/admin/login", adminController.adminLogin);
// router.post("/admin/logout", adminController.adminLogout);
// router.get("/admin/me", adminController.checkAdminSession);
router.get('/users', adminController.getPaginatedUsers);

router.put("/users/:id", adminController.updateUser);

router.delete('/users/:id', adminController.deleteUser);

router.patch('/users/:id/toggle-disable', adminController.toggleUserDisable);

router.get('/phones', adminController.getPaginatedPhones);

router.put("/phones/:id", adminController.updatePhone);

router.put("/phones/:id/toggle-disable", adminController.togglePhoneDisable);

router.delete("/phones/:id", adminController.deletePhone);

module.exports = router;
