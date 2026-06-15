// OrderHistory Repository
// Handles all database operations for order history data
const OrderHistory = require('../models/OrderHistoryModel')

class OrderHistoryRepository {
  // Find all order history entries
  async findAll() {
    return await OrderHistory.find().populate('order_id').lean()
  }

  // Create a new order history entry
  async create(historyData) {
    const history = new OrderHistory(historyData)
    return await history.save()
  }
}

module.exports = new OrderHistoryRepository()
