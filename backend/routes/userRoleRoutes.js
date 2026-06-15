const express = require('express');
const router = express.Router();

// Import controller và các middleware cần thiết
const { getStatus, updateUserStatus } = require('../controllers/userRoleController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Định nghĩa các route
router.get('/:userId', authMiddleware, getStatus);
router.put('/update-status', authMiddleware, adminMiddleware, updateUserStatus);

module.exports = router;