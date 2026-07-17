// Payment Repository
// Handles all database operations for payment data
const Payment = require('../models/PaymentModel')

class PaymentRepository {
  // Find all payments with pagination
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find()
        .populate('order_id', 'total_price status created_at')
        .populate('user_id', 'username email')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Payment.countDocuments()
    ]);

    return {
      payments,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }
  // Create a new payment
  async create(paymentData) {
    const payment = new Payment(paymentData)
    return await payment.save()
  }

  // Update payment status
  async update(id, paymentData) {
    return await Payment.findByIdAndUpdate(id, paymentData, { new: true })
  }
}

module.exports = new PaymentRepository()
