const express = require("express");
const router = express.Router();
const {
  getPhoneSeller,
  getPhoneById,
  getMyPhones,
  createPhone,
  deletePhone,
  phoneEnableDisable,
  toggleReviewHidden
} = require("../controllers/phoneController.js");

// GET /api/phones → Get all phones
router.get("/", getPhoneSeller);

// GET /api/phones/:id → Get a single phone by ID
router.get("/:id", getPhoneById);

router.get("/api/phones/my-listings", getMyPhones);
router.post("/api/phones/create-phone", createPhone);
router.delete("/api/phones/:id", deletePhone);
router.put("/api/phones/:id", phoneEnableDisable);
router.put('/api/phones/:phoneId/reviews/:reviewId', toggleReviewHidden);

module.exports = router;
