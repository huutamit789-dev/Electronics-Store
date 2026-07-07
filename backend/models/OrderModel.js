const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  total_price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  created_at: { type: Date, default: Date.now },
  momo_order_id: { type: String }, // Lưu orderId từ MoMo để tìm lại sau
  coupon_code: { type: String, default: null }, // Mã giảm giá được sử dụng
  discount_amount: { type: Number, default: 0 }, // Số tiền được giảm giá
  original_price: { type: Number, default: 0 } // Giá trị gốc của đơn hàng trước giảm giá
});

module.exports = mongoose.model('Order', orderSchema);