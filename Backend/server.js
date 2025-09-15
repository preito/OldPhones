/**
 * USYD COMP5347 Assignment 2 - Mobile Website
 * Created 10th Aug 2025
 */
const User = require("./models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
var routes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // added Admin routes
const phoneRoutes = require("./routes/phoneRoutes");
const MongoStore = require("connect-mongo");
const setUpImages = require("./utils/setUpImages");
const ensureSuperAdmin = require("./utils/ensureSuperadmin");
const updateUsers = require("./utils/updateUsers");
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
      sameSite: "lax",
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // to parse json data from the request
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);
app.use("/", phoneRoutes);
app.use("/", routes);
app.use("/", adminRoutes); // separate admin route

updateUsers();
// Initialize core admin and image setup
ensureSuperAdmin();
setUpImages.uploadImages();

app.listen(PORT, function () {
  console.log("Application is listening on port " + PORT);
});
