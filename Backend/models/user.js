const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
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
    ],
    transactions: [
      {
        items: [
          {
            phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
            quantity: Number,
          },
        ],
        total: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    sadmin: { type: Boolean },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
); // Use this if your collection name is explicitly `user`

module.exports = mongoose.model("User", userSchema);
