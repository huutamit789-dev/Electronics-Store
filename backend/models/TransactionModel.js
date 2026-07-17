const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'purchase', 'refund'], 
    required: true 
  }, // Loại giao dịch: nạp tiền, mua hàng, hoàn tiền
  amount: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Số tiền giao dịch
  balance_before: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Số dư trước giao dịch
  balance_after: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Số dư sau giao dịch
  description: { 
    type: String, 
    default: '' 
  }, // Mô tả giao dịch
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  }, // Trạng thái giao dịch
  order_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    default: null 
  }, // Reference đến đơn hàng (nếu là purchase hoặc refund)
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Index để tìm kiếm nhanh theo user_id
transactionSchema.index({ user_id: 1, created_at: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
