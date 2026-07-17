const TransactionService = require('../services/TransactionService');
const { asyncHandler } = require('../middleware/asyncHandler');

/**
 * @desc Get user account information (balance, VIP level)
 * @route GET /transactions/account
 * @access Private (User)
 */
const getAccountInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const accountInfo = await TransactionService.getUserAccountInfo(userId);
  
  res.success(accountInfo, 'Account information retrieved successfully');
});

/**
 * @desc Deposit money into account
 * @route POST /transactions/deposit
 * @access Private (User)
 */
const depositMoney = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { amount, description } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Số tiền nạp phải lớn hơn 0' 
    });
  }
  
  const result = await TransactionService.depositMoney(
    userId, 
    amount, 
    description || 'Nạp tiền vào tài khoản'
  );
  
  res.success(result, 'Deposit successful', 201);
});

/**
 * @desc Get transaction history
 * @route GET /transactions/history
 * @access Private (User)
 */
const getTransactionHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const result = await TransactionService.getTransactionHistory(userId, page, limit);
  
  res.success(result, 'Transaction history retrieved successfully');
});

/**
 * @desc Get VIP levels information (public)
 * @route GET /transactions/vip-levels
 * @access Public
 */
const getVipLevels = asyncHandler(async (req, res) => {
  res.success(TransactionService.VIP_LEVELS, 'VIP levels information retrieved successfully');
});

module.exports = {
  getAccountInfo,
  depositMoney,
  getTransactionHistory,
  getVipLevels
};
