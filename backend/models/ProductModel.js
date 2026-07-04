const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock_quantity: { type: Number, default: 0 },
  image_url: String,
  images: [String], // Mảng các ảnh sản phẩm
  specs: {
    // Thông số kỹ thuật
    screen: String,
    camera: String,
    memory: String,
    storage: String,
    battery: String,
    processor: String,
    os: String,
    weight: String,
    dimensions: String,
    other: [String] // Các thông số khác
  },
  variants: [{
    // Biến thể sản phẩm (màu sắc, dung lượng...)
    name: String, // Tên biến thể (ví dụ: "Đen 128GB")
    color: String,
    storage: String,
    price: Number,
    stock_quantity: Number,
    image_url: String
  }],
  // Thêm liên kết tới cate
  cate_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'cate', 
    required: true 
  }
});

module.exports = mongoose.model('Product', productSchema);