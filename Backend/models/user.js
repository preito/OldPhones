const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
}, { collection: 'userlist' }); // Use this if your collection name is explicitly `user`

module.exports = mongoose.model('User', userSchema);
