const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payment_method: { type: String, enum: ['cod', 'credit_card', 'momo', 'zalopay', 'balance'], required: true },
  payment_status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  transaction_id: String, // Mã giao dịch trả về từ cổng thanh toán (ví dụ: PayPal/Stripe)
  amount: Number,
  paid_at: Date,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);