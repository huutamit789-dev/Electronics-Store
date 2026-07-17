// Route definitions for transaction operations
// This file maps HTTP paths to controller functions.
const express = require('express');
const { 
  getAccountInfo, 
  depositMoney, 
  getTransactionHistory, 
  getVipLevels 
} = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /transactions/vip-levels -> get VIP levels information (public)
router.get('/vip-levels', getVipLevels);

// GET /transactions/account -> get user account info (balance, VIP)
router.get('/account', authMiddleware, getAccountInfo);

// POST /transactions/deposit -> deposit money into account
router.post('/deposit', authMiddleware, depositMoney);

// GET /transactions/history -> get transaction history
router.get('/history', authMiddleware, getTransactionHistory);

module.exports = router;
