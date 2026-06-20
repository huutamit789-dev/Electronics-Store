const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image_url: { type: String, required: true },
  link_url: String,
  position: { type: String, enum: ['main', 'sub1', 'sub2'], required: true },
  is_active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
