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
  momo_order_id: { type: String } // Lưu orderId từ MoMo để tìm lại sau
});

module.exports = mongoose.model('Order', orderSchema);