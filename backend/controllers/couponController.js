/**
 * @file couponController.js
 * @description Controller handling API logic for verification, creation, deletion, and retrieval of coupons.
 */

const Coupon = require('../models/CouponModel');
const { asyncHandler } = require('../middleware/asyncHandler');

/**
 * @desc Verify if a coupon code is valid and calculate the discount amount
 * @route POST /api/coupons/verify
 * @access Public (Authenticated users)
 */
const verifyCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  if (!code) {
    const error = new Error('Mã giảm giá là bắt buộc');
    error.status = 400;
    throw error;
  }

  if (orderAmount === undefined || orderAmount <= 0) {
    const error = new Error('Giá trị đơn hàng không hợp lệ');
    error.status = 400;
    throw error;
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();

  if (!coupon) {
    const error = new Error('Mã giảm giá không tồn tại');
    error.status = 404;
    throw error;
  }

  if (!coupon.is_active) {
    const error = new Error('Mã giảm giá đã bị vô hiệu hóa');
    error.status = 400;
    throw error;
  }

  const now = new Date();
  if (new Date(coupon.expiration_date) < now) {
    const error = new Error('Mã giảm giá đã hết hạn sử dụng');
    error.status = 400;
    throw error;
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    const error = new Error('Mã giảm giá đã đạt giới hạn sử dụng tối đa');
    error.status = 400;
    throw error;
  }

  if (orderAmount < coupon.min_order_value) {
    const error = new Error(`Đơn hàng tối thiểu phải từ ${coupon.min_order_value.toLocaleString()}đ để sử dụng mã này`);
    error.status = 400;
    throw error;
  }

  // Tính số tiền được chiết khấu
  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = (orderAmount * coupon.discount_value) / 100;
    if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
      discountAmount = coupon.max_discount_amount;
    }
  } else if (coupon.discount_type === 'fixed') {
    discountAmount = coupon.discount_value;
  }

  // Không giảm quá giá trị gốc của đơn hàng
  if (discountAmount > orderAmount) {
    discountAmount = orderAmount;
  }

  res.success({
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    discountAmount
  }, 'Mã giảm giá hợp lệ');
});

/**
 * @desc Create a new coupon (Admin Only)
 * @route POST /api/coupons
 * @access Private (Admin only)
 */
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount_type, discount_value, min_order_value, max_discount_amount, expiration_date, max_uses } = req.body;

  if (!code || !discount_type || discount_value === undefined || !expiration_date) {
    const error = new Error('Vui lòng cung cấp đầy đủ thông tin: code, discount_type, discount_value, expiration_date');
    error.status = 400;
    throw error;
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    const error = new Error('Mã giảm giá đã tồn tại trong hệ thống');
    error.status = 400;
    throw error;
  }

  const newCoupon = new Coupon({
    code: code.toUpperCase(),
    discount_type,
    discount_value,
    min_order_value,
    max_discount_amount,
    expiration_date,
    max_uses
  });

  await newCoupon.save();

  res.success(newCoupon, 'Tạo mã giảm giá thành công', 201);
});

/**
 * @desc Get all coupons list (Admin Only)
 * @route GET /api/coupons
 * @access Private (Admin only)
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ created_at: -1 }).lean();
  res.success(coupons, 'Lấy danh sách mã giảm giá thành công');
});

/**
 * @desc Delete a coupon (Admin Only)
 * @route DELETE /api/coupons/:id
 * @access Private (Admin only)
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  const deleted = await Coupon.findByIdAndDelete(req.params.id);
  if (!deleted) {
    const error = new Error('Không tìm thấy mã giảm giá để xóa');
    error.status = 404;
    throw error;
  }
  res.success(null, 'Xóa mã giảm giá thành công');
});

module.exports = {
  verifyCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon
};
