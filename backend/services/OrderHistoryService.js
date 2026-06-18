const OrderHistoryRepository = require('../repositories/OrderHistoryRepository');

class OrderHistoryService {
  // Truyền user vào hàm để kiểm tra quyền
  async getOrderHistory(user, page = 1, limit = 10) {
    const allowedRoles = ['admin'];
    if (!user || !allowedRoles.includes(user.role)) {
      const error = new Error('Bạn không có quyền truy cập');
      error.status = 403;
      throw error;
    }
    if (user.role === 'admin') {
      return await OrderHistoryRepository.findAll(page, limit);
    }
  }
}

module.exports = new OrderHistoryService();