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

  // Create order history entry
  async createOrderHistory(historyData) {
    if (!historyData.order_id) throw new Error('Order ID is required');
    if (!historyData.old_status) throw new Error('Old status is required');
    if (!historyData.new_status) throw new Error('New status is required');

    return await OrderHistoryRepository.create(historyData);
  }
}

module.exports = new OrderHistoryService();