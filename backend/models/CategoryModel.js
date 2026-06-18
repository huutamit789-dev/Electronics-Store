const mongoose = require('mongoose');

const cateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});

module.exports = mongoose.model('cate', cateSchema, 'cates');
