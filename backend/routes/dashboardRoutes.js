/**
 * @file dashboardRoutes.js
 * @description Defines HTTP routes for administrative dashboard analytics.
 * Protects statistics endpoint to ensure only authorized administrators can access.
 */

const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route GET /api/dashboard/stats
 * @description Retrieves statistical summary, monthly revenue charts, and top products for admin dashboard.
 * @access Private (Admin only)
 */
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
