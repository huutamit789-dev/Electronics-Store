/**
 * @file seed_coupons.js
 * @description Seeder script to insert test coupons into the MongoDB database.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Coupon = require('../models/CouponModel');

const dbUri = `${process.env.DB_STRING}${process.env.DB_NAME || 'ElectronicsDB'}?authSource=admin`;

console.log('Connecting to database at:', dbUri);

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB database successfully!');

    // Xóa các coupon cũ để tránh trùng lặp mã KM
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons.');

    const coupons = [
      {
        code: 'TEST10',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_value: 100000,
        max_discount_amount: 100000, // giảm tối đa 100k
        expiration_date: new Date('2028-12-31T23:59:59Z'),
        max_uses: 100,
        uses_count: 0,
        is_active: true
      },
      {
        code: 'FIXED50K',
        discount_type: 'fixed',
        discount_value: 50000,
        min_order_value: 200000,
        expiration_date: new Date('2028-12-31T23:59:59Z'),
        max_uses: 50,
        uses_count: 0,
        is_active: true
      },
      {
        code: 'EXPIRED',
        discount_type: 'percentage',
        discount_value: 50,
        min_order_value: 50000,
        expiration_date: new Date('2025-01-01T00:00:00Z'), // Đã hết hạn
        max_uses: 10,
        uses_count: 0,
        is_active: true
      },
      {
        code: 'MAXUSES',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_value: 50000,
        expiration_date: new Date('2028-12-31T23:59:59Z'),
        max_uses: 5,
        uses_count: 5, // Đã hết lượt dùng
        is_active: true
      }
    ];

    await Coupon.insertMany(coupons);
    console.log('Successfully seeded 4 test coupons:');
    console.log('  - TEST10: Giảm 10% (tối đa 100k) cho đơn từ 100k');
    console.log('  - FIXED50K: Giảm thẳng 50k cho đơn từ 200k');
    console.log('  - EXPIRED: Mã đã hết hạn (Giảm 50%)');
    console.log('  - MAXUSES: Mã đã hết lượt sử dụng (Giảm 10%)');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection or seeding failed:', err);
    process.exit(1);
  });
