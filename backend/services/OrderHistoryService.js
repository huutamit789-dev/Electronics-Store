const OrderHistoryRepository = require('../repositories/OrderHistoryRepository')

class OrderHistoryService {
  
  // Hàm trợ giúp để ném lỗi nghiệp vụ
  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

  // Get all order history entries
  async getAllOrderHistory(page = 1, limit = 10) {
    try {
      return await OrderHistoryRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllOrderHistory]:', error);
      throw new Error('Lỗi truy xuất lịch sử đơn hàng');
    }
  }

  // Create a new order history entry
  async addOrderHistory(historyData) {
    const { order_id, new_status } = historyData;

    // Validation
    if (!order_id || !new_status) {
      this._throwError('order_id and new_status are required', 400);
    }

    try {
      return await OrderHistoryRepository.create(historyData);
    } catch (error) {
      console.error('Service Error [addOrderHistory]:', error);
      this._throwError('Không thể tạo lịch sử đơn hàng', 500);
    }
  }
}

module.exports = new OrderHistoryService()