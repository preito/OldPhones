/**
 * USYD COMP5347 Assignment 2 - Mobile Website
 * Created 10th May 2025
 */
const User = require("./models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
var routes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // added Admin routes
const MongoStore = require('connect-mongo');
const PORT = process.env.PORT || 5000;
const app = express();
connectDB();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day (Change if longer is needed)
      sameSite: "lax"
    },
  })
);

app.use(cors());
app.use(express.json()); // to parse json data from the request
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);
app.use("/", routes);
app.use("/admin", adminRoutes);  // separate admin route

async function ensureSuperAdmin() {
  try {
    const existing = await User.findOne({ sadmin: true });
    if (!existing) {
      const hashed = await bcrypt.hash("Admin@1234", 10); // Choose a secure password
      const admin = new User({
        firstname: "Super",
        lastname: "Admin",
        email: "admin@oldphonedeals.com",
        password: hashed,
        sadmin: true,
      });
      await admin.save();
      console.log("✅ Super admin account created.");
    } else {
      console.log("🔒 Super admin already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to create super admin:", err);
  }
}

ensureSuperAdmin();

app.listen(PORT, function () {
  console.log("Application is listening on url http://localhost:" + PORT + "/");
});
