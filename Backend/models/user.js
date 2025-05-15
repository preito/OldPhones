const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phone",
      },
    ],
    cart: [
      {
        phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
        quantity: { type: Number, default: 1 },
      },
      sadmin: { type: Boolean, default: false },
    ],
    // verified: { type: Boolean, required: true }, Will need something like this for email verification
  },
  { timestamps: true }
); // Use this if your collection name is explicitly `user`

module.exports = mongoose.model("User", userSchema);
