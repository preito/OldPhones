const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  comment: String,
});

const phoneSchema = new mongoose.Schema({
  title: String,
  brand: String,
  image: String,
  stock: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: Number,
  disabled: { type: Boolean, default: false },
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Phone", phoneSchema);
