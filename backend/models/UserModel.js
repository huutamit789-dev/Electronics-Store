const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Thêm unique: true cho username
  email: { type: String, unique: true, sparse: true }, // email không còn required, thêm sparse: true
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  
  // Thêm trường role và status vào đây
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['attempt', 'approved', 'banned'], 
    default: 'attempt' 
  },
  
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;