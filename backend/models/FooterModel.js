const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  company_description: String,
  policy_title: String,
  policies: [{
    title: String,
    link: String
  }],
  contact_title: String,
  contacts: [{
    icon: String,
    text: String
  }],
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Footer', footerSchema);
