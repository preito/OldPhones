const mongoose = require('mongoose');
require('dotenv').config();

// Use an async function to connect to the database
const connectDB = async () => {
  try {
    // Replace with your MongoDB URI
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host} and uri is ${process.env.MONGO_URI}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit if there's a connection error
  }
};

module.exports = connectDB;
