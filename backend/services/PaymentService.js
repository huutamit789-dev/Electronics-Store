// Payment Service
// Handles business logic and validation for payment operations
const PaymentRepository = require('../repositories/PaymentRepository')

const VALID_METHODS = ['cod', 'credit_card', 'momo', 'zalopay']

class PaymentService {
  // Get all payments
  async getAllPayments() {
    return await PaymentRepository.findAll()
  }

  // Create a new payment
  async createPayment(paymentData) {
    const { order_id, payment_method } = paymentData

    // Validation
    if (!order_id || !payment_method) {
      const error = new Error('order_id and payment_method are required')
      error.status = 400
      throw error
    }

    if (!VALID_METHODS.includes(payment_method)) {
      const error = new Error(`Payment method must be one of: ${VALID_METHODS.join(', ')}`)
      error.status = 400
      throw error
    }

    const newPayment = await PaymentRepository.create(paymentData)
    return newPayment
  }
}

module.exports = new PaymentService()
