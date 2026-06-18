// Order Repository
// Handles all database operations for order data
const Order = require('../models/OrderModel')

class OrderRepository {
  // Find all orders with pagination
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('user_id', '-password') // Loại bỏ password của user
        .populate('items.product_id')
        .sort({ createdAt: -1 }) // Sắp xếp theo đơn hàng mới nhất
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments()
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }

  // Find order by ID
  async findById(id) {
    return await Order.findById(id).populate('user_id', '-password').populate('items.product_id').lean()
  }

  // Create a new order
  async create(orderData) {
    const order = new Order(orderData)
    return await order.save()
  }

  // Update order
  async update(id, orderData) {
    return await Order.findByIdAndUpdate(id, orderData, { new: true })
  }

  // Update order status
  async updateStatus(id, status) {
    return await Order.findByIdAndUpdate(id, { status }, { new: true })
  }
}

module.exports = new OrderRepository()
