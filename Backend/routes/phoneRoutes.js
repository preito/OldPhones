const express = require("express");
const router = express.Router();
const {
  getPhoneSeller,
  getPhoneById,
  getMyPhones,
  createPhone,
  deletePhone,
  phoneEnableDisable,
  toggleReviewHidden,
  getImageByName,
  getImageById,
  toggleOwnReviewHidden
} = require("../controllers/phoneController.js");

// GET /api/phones → Get all phones
router.get("/api/phones", getPhoneSeller);

// GET /api/phones/:id → Get a single phone by ID
router.get("/api/phones/:id", getPhoneById);

router.get("/api/phones/my-listings", getMyPhones);
router.post("/api/phones/create-phone", createPhone);
router.delete("/api/phones/:id", deletePhone);
router.put("/api/phones/:id", phoneEnableDisable);
router.put('/api/phones/:phoneId/reviews/:reviewId', toggleReviewHidden);
router.get("/api/phone/image/name/:name", getImageByName);
router.put("/api/phone/image/id/:id", getImageById);
router.put("/api/phones/:phoneId/reviews/:reviewId/user-toggle", toggleOwnReviewHidden);

module.exports = router;
