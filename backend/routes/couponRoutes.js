/**
 * @file couponRoutes.js
 * @description Routing rules and middleware permissions for Coupon-related operations.
 */

const express = require('express');
const { verifyCoupon, createCoupon, getAllCoupons, deleteCoupon } = require('../controllers/couponController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route POST /api/coupons/verify
 * @description Validates a discount code against the total checkout amount.
 * @access Private (Authenticated users)
 */
router.post('/verify', authMiddleware, verifyCoupon);

/**
 * @route POST /api/coupons
 * @description Creates a new discount coupon.
 * @access Private (Admin only)
 */
router.post('/', authMiddleware, adminMiddleware, createCoupon);

/**
 * @route GET /api/coupons
 * @description Retrieves all discount coupons.
 * @access Private (Admin only)
 */
router.get('/', authMiddleware, adminMiddleware, getAllCoupons);

/**
 * @route DELETE /api/coupons/:id
 * @description Deletes a coupon by ID.
 * @access Private (Admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteCoupon);

module.exports = router;
