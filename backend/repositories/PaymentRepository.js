// Payment Repository
// Handles all database operations for payment data
const Payment = require('../models/Payment')

class PaymentRepository {
  // Find all payments
  async findAll() {
    return await Payment.find().populate('order_id').lean()
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
