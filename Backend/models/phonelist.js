const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  hidden: { type: Boolean, default: false }
});

const phoneListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  disabled: { type: Boolean, default: false },
  reviews: [reviewSchema]
});

module.exports = mongoose.model('PhoneListing', phoneListingSchema);
