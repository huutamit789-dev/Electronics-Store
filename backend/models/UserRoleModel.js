const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  // Trường này là "cầu nối" đến bảng User
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true 
  },
  role: { type: String, default: 'user' },
  status: { type: String, enum: ['attempt', 'approved', 'admin'], default: 'attempt' }
});

module.exports = mongoose.model('UserRole', userRoleSchema);