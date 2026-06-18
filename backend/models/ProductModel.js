const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock_quantity: { type: Number, default: 0 },
  image_url: String,
  // Thêm liên kết tới cate
  cate_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'cate', 
    required: true 
  }
});

module.exports = mongoose.model('Product', productSchema);