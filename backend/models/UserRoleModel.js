const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
    index: true ,
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'moderator'],
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['attempt', 'approved', 'banned'], 
    default: 'attempt' 
  }
}, { timestamps: true }); 

module.exports = mongoose.model('UserRole', userRoleSchema, 'user_role');