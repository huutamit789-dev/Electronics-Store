/**
 * @file CouponModel.js
 * @description Mongoose schema definition for the Coupon collection.
 * Stores discount rates, coupon constraints, usage counts, and expiration dates.
 */

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true 
  },
  discount_type: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discount_value: { 
    type: Number, 
    required: true // Ví dụ: 10 đại diện cho 10%, hoặc 50000 đại diện cho 50.000 VND
  },
  min_order_value: { 
    type: Number, 
    default: 0 // Giá trị đơn hàng tối thiểu để áp dụng mã
  },
  max_discount_amount: { 
    type: Number, 
    default: null // Chỉ áp dụng cho kiểu percentage, giới hạn số tiền giảm tối đa (ví dụ giảm tối đa 100k)
  },
  expiration_date: { 
    type: Date, 
    required: true 
  },
  max_uses: { 
    type: Number, 
    default: null // Số lần sử dụng tối đa của mã (null là không giới hạn)
  },
  uses_count: { 
    type: Number, 
    default: 0 // Số lần mã đã được sử dụng thực tế
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
