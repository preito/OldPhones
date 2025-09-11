const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import your models
const Phone = require('./models/Phone');
const User = require('./models/user');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for initialization');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const initializeDatabase = async () => {
  await connectDB();
  
  try {
    // Import phone data
    const phoneData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'phonelisting.json'), 'utf8'));
    await Phone.insertMany(phoneData);
    console.log('Phone data imported successfully');
    
    // Import user data
    const userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'userlist.json'), 'utf8'));
    await User.insertMany(userData);
    console.log('User data imported successfully');
    
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

initializeDatabase();
