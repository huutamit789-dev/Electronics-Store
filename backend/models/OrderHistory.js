const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  old_status: String,
  new_status: String,
  changed_at: { type: Date, default: Date.now },
  note: String // Ghi chú lý do thay đổi (nếu có)
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);