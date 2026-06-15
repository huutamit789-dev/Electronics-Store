// Order Service
// Handles business logic and validation for order operations
const OrderRepository = require('../repositories/OrderRepository')

const VALID_STATUSES = ['pending', 'completed', 'cancelled']

class OrderService {
  // Get all orders
  async getAllOrders() {
    return await OrderRepository.findAll()
  }

  // Create a new order
  async createOrder(orderData) {
    const { user_id, items, total_price } = orderData

    // Validation
    if (!user_id || !items || !total_price) {
      const error = new Error('user_id, items, and total_price are required')
      error.status = 400
      throw error
    }

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error('items must be a non-empty array')
      error.status = 400
      throw error
    }

    if (total_price <= 0) {
      const error = new Error('total_price must be greater than 0')
      error.status = 400
      throw error
    }

    const newOrder = await OrderRepository.create(orderData)
    return newOrder
  }

  // Update order status
  async updateOrderStatus(id, status) {
    // Validation
    if (!id || !status) {
      const error = new Error('Order ID and status are required')
      error.status = 400
      throw error
    }

    if (!VALID_STATUSES.includes(status)) {
      const error = new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`)
      error.status = 400
      throw error
    }

    const updated = await OrderRepository.updateStatus(id, status)
    if (!updated) {
      const error = new Error('Order not found')
      error.status = 404
      throw error
    }

    return updated
  }
}

module.exports = new OrderService()
