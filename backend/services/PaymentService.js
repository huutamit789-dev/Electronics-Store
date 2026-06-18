const PaymentRepository = require('../repositories/PaymentRepository');

const VALID_METHODS = ['cod', 'credit_card', 'momo', 'zalopay'];

class PaymentService {
  // Lấy danh sách tất cả các thanh toán
  async getAllPayments(user, page = 1, limit = 10) {
    // Kiểm tra quyền truy cập
    const allowedRoles = ['admin'];
    if (!user || !allowedRoles.includes(user.role)) {
      const error = new Error('Bạn không có quyền truy cập');
      error.status = 403;
      throw error;
    }

    return await PaymentRepository.findAll(page, limit);
  }

  // Tạo một giao dịch thanh toán mới
  async createPayment(user, paymentData) {
    // Kiểm tra quyền truy cập
    const allowedRoles = ['admin'];
    if (!user || !allowedRoles.includes(user.role)) {
      const error = new Error('Bạn không có quyền truy cập');
      error.status = 403;
      throw error;
    }

    const { order_id, payment_method } = paymentData;

    // Validation cơ bản
    if (!order_id || !payment_method) {
      throw new Error('order_id và payment_method là bắt buộc');
    }

    if (!VALID_METHODS.includes(payment_method)) {
      throw new Error(`Phương thức thanh toán không hợp lệ. Hỗ trợ: ${VALID_METHODS.join(', ')}`);
    }

    return await PaymentRepository.create(paymentData);
  }
}

module.exports = new PaymentService();