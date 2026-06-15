// OrderHistory Service
// Handles business logic and validation for order history operations
const OrderHistoryRepository = require('../repositories/OrderHistoryRepository')

class OrderHistoryService {
  // Get all order history entries
  async getAllOrderHistory() {
    return await OrderHistoryRepository.findAll()
  }

  // Create a new order history entry
  async addOrderHistory(historyData) {
    const { order_id, new_status, old_status } = historyData

    // Validation
    if (!order_id || !new_status) {
      const error = new Error('order_id and new_status are required')
      error.status = 400
      throw error
    }

    const newHistory = await OrderHistoryRepository.create(historyData)
    return newHistory
  }
}

module.exports = new OrderHistoryService()
