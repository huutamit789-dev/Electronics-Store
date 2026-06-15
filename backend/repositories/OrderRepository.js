// Order Repository
// Handles all database operations for order data
const Order = require('../models/Order')

class OrderRepository {
  // Find all orders
  async findAll() {
    return await Order.find().populate('user_id').populate('items.product_id').lean()
  }

  // Find order by ID
  async findById(id) {
    return await Order.findById(id).populate('user_id').populate('items.product_id').lean()
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
