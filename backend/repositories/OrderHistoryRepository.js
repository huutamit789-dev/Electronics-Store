// OrderHistory Repository
// Handles all database operations for order history data
const OrderHistory = require('../models/OrderHistoryModel')

class OrderHistoryRepository {
  // Find all order history entries with pagination
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [history, total] = await Promise.all([
      OrderHistory.find()
        .populate({
          path: 'order_id',
          populate: {
            path: 'user_id',
            select: 'username email'
          },
          select: 'total_price status created_at'
        })
        .sort({ changed_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      OrderHistory.countDocuments()
    ]);

    return {
      history,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }

  // Create a new order history entry
  async create(historyData) {
    const history = new OrderHistory(historyData)
    return await history.save()
  }
}

module.exports = new OrderHistoryRepository()
