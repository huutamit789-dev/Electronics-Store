const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');
const Payment = require('../models/PaymentModel');
const OrderHistoryService = require('../services/OrderHistoryService');

// Cấu hình VIP levels dựa trên tổng chi tiêu
const VIP_LEVELS = {
  bronze: { min: 0, max: 5000000, discount: 0 },
  silver: { min: 5000000, max: 20000000, discount: 0.05 },
  gold: { min: 20000000, max: 50000000, discount: 0.1 },
  platinum: { min: 50000000, max: 100000000, discount: 0.15 },
  diamond: { min: 100000000, max: Infinity, discount: 0.2 }
};

/**
 * Tính toán hạng VIP dựa trên tổng chi tiêu
 */
const calculateVipLevel = (totalSpent) => {
  for (const [level, config] of Object.entries(VIP_LEVELS)) {
    if (totalSpent >= config.min && totalSpent < config.max) {
      return level;
    }
  }
  return 'bronze';
};

/**
 * Lấy thông tin tài khoản người dùng (số dư, VIP level)
 */
const getUserAccountInfo = async (userId) => {
  const user = await User.findById(userId).select('balance total_spent vip_level username');
  
  if (!user) {
    throw new Error('User not found');
  }

  // Tính lại VIP level dựa trên total_spent để đảm bảo chính xác
  const calculatedVipLevel = calculateVipLevel(user.total_spent);
  
  // Cập nhật nếu có sự khác biệt
  if (user.vip_level !== calculatedVipLevel) {
    user.vip_level = calculatedVipLevel;
    await user.save();
  }

  const vipConfig = VIP_LEVELS[user.vip_level];

  return {
    user_id: user._id,
    username: user.username,
    balance: user.balance,
    total_spent: user.total_spent,
    vip_level: user.vip_level,
    discount_percentage: vipConfig.discount,
    next_level: getNextVipLevel(user.total_spent),
    amount_to_next_level: getAmountToNextLevel(user.total_spent)
  };
};

/**
 * Lấy hạng VIP tiếp theo
 */
const getNextVipLevel = (totalSpent) => {
  const levels = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const currentLevel = calculateVipLevel(totalSpent);
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null; // Đã đạt mức cao nhất
};

/**
 * Tính số tiền cần để lên hạng tiếp theo
 */
const getAmountToNextLevel = (totalSpent) => {
  const nextLevel = getNextVipLevel(totalSpent);
  if (!nextLevel) return 0;
  
  const nextConfig = VIP_LEVELS[nextLevel];
  return nextConfig.min - totalSpent;
};

/**
 * Nạp tiền vào tài khoản
 */
const depositMoney = async (userId, amount, description = 'Nạp tiền vào tài khoản') => {
  if (amount <= 0) {
    throw new Error('Số tiền nạp phải lớn hơn 0');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const balanceBefore = user.balance;
  const balanceAfter = balanceBefore + amount;

  // Tạo transaction record
  const transaction = new Transaction({
    user_id: userId,
    type: 'deposit',
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    description: description,
    status: 'completed'
  });

  // Cập nhật số dư user
  user.balance = balanceAfter;
  
  await Promise.all([
    transaction.save(),
    user.save()
  ]);

  return {
    transaction_id: transaction._id,
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    current_balance: user.balance
  };
};

/**
 * Lấy lịch sử giao dịch của user
 */
const getTransactionHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const transactions = await Transaction.find({ user_id: userId })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .populate('order_id', 'total_price status created_at');
  
  const total = await Transaction.countDocuments({ user_id: userId });
  
  return {
    transactions: transactions,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(total / limit),
      total_items: total,
      items_per_page: limit
    }
  };
};

/**
 * Trừ tiền khi mua hàng (được gọi từ OrderService)
 */
const deductForPurchase = async (userId, amount, orderId, description = 'Thanh toán đơn hàng') => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.balance < amount) {
    throw new Error('Số dư không đủ');
  }

  const balanceBefore = user.balance;
  const balanceAfter = balanceBefore - amount;

  // Tạo transaction record
  const transaction = new Transaction({
    user_id: userId,
    type: 'purchase',
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    description: description,
    status: 'completed',
    order_id: orderId
  });

  // Tạo Payment record cho admin/payments
  const payment = new Payment({
    order_id: orderId,
    user_id: userId,
    payment_method: 'balance',
    payment_status: 'paid',
    transaction_id: transaction._id.toString(),
    amount: amount,
    paid_at: new Date()
  });

  // Cập nhật số dư và tổng chi tiêu
  user.balance = balanceAfter;
  user.total_spent += amount;

  // Tính và cập nhật VIP level
  const newVipLevel = calculateVipLevel(user.total_spent);
  user.vip_level = newVipLevel;

  await Promise.all([
    transaction.save(),
    payment.save(),
    user.save()
  ]);

  // Tạo OrderHistory record cho admin/order-history
  try {
    await OrderHistoryService.createOrderHistory({
      order_id: orderId,
      old_status: 'pending',
      new_status: 'completed',
      note: `Thanh toán bằng tài khoản thành công. Số tiền: ${amount.toLocaleString()}đ`
    });
  } catch (error) {
    console.error('Error creating order history:', error);
    // Không throw error vì payment đã thành công
  }

  return {
    transaction_id: transaction._id,
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    current_balance: user.balance,
    new_vip_level: newVipLevel
  };
};

/**
 * Hoàn tiền khi hủy đơn hàng
 */
const refundMoney = async (userId, amount, orderId, description = 'Hoàn tiền đơn hàng') => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const balanceBefore = user.balance;
  const balanceAfter = balanceBefore + amount;

  // Tạo transaction record
  const transaction = new Transaction({
    user_id: userId,
    type: 'refund',
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    description: description,
    status: 'completed',
    order_id: orderId
  });

  // Cập nhật số dư và trừ tổng chi tiêu
  user.balance = balanceAfter;
  user.total_spent = Math.max(0, user.total_spent - amount);
  
  // Tính và cập nhật VIP level
  const newVipLevel = calculateVipLevel(user.total_spent);
  user.vip_level = newVipLevel;
  
  await Promise.all([
    transaction.save(),
    user.save()
  ]);

  return {
    transaction_id: transaction._id,
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    current_balance: user.balance,
    new_vip_level: newVipLevel
  };
};

module.exports = {
  getUserAccountInfo,
  depositMoney,
  getTransactionHistory,
  deductForPurchase,
  refundMoney,
  VIP_LEVELS
};
