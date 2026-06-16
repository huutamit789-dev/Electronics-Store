const OrderHistoryRepository = require('../repositories/OrderHistoryRepository');

class OrderHistoryService {
  // Lấy tất cả lịch sử đơn hàng với phân trang
  async getAllOrderHistory(page = 1, limit = 10) {
    return await OrderHistoryRepository.findAll(page, limit);
  }

  // Tạo một bản ghi lịch sử đơn hàng mới
  async addOrderHistory(historyData) {
    const { order_id, new_status } = historyData;

    // Validation cơ bản
    if (!order_id || !new_status) {
      throw new Error('order_id and new_status are required');
    }

    // Không cần try-catch ở đây nếu bạn đã có Error Middleware ở tầng trên
    return await OrderHistoryRepository.create(historyData);
  }
}

module.exports = new OrderHistoryService();