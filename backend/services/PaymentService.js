const PaymentRepository = require('../repositories/PaymentRepository')

const VALID_METHODS = ['cod', 'credit_card', 'momo', 'zalopay']

class PaymentService {
  
  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

  // Get all payments
  async getAllPayments(page = 1, limit = 10) {
    try {
      return await PaymentRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllPayments]:', error);
      throw new Error('Lỗi truy xuất danh sách thanh toán');
    }
  }

  // Create a new payment
  async createPayment(paymentData) {
    const { order_id, payment_method } = paymentData

    // Validation
    if (!order_id || !payment_method) {
      this._throwError('order_id và payment_method là bắt buộc', 400);
    }

    if (!VALID_METHODS.includes(payment_method)) {
      this._throwError(`Phương thức thanh toán không hợp lệ. Hỗ trợ: ${VALID_METHODS.join(', ')}`, 400);
    }

    try {
      return await PaymentRepository.create(paymentData);
    } catch (error) {
      console.error('Service Error [createPayment]:', error);
      throw new Error('Không thể tạo giao dịch thanh toán');
    }
  }
}

module.exports = new PaymentService()