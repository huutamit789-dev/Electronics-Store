// Cart Repository
// Handles all database operations for cart data
const Cart = require('../models/Cart')

class CartRepository {
  // Find cart by user_id
  async findByUserId(user_id) {
    return await Cart.findOne({ user_id }).populate('items.product_id').lean()
  }

  // Find cart by user_id and return full document (not lean)
  async findByUserIdFull(user_id) {
    return await Cart.findOne({ user_id })
  }

  // Create a new cart
  async create(user_id) {
    const cart = new Cart({ user_id, items: [] })
    return await cart.save()
  }

  // Update cart
  async update(cart) {
    return await cart.save()
  }

  // Delete cart
  async delete(user_id) {
    return await Cart.findOneAndDelete({ user_id })
  }

  // Clear all items in cart
  async clearItems(user_id) {
    return await Cart.findOneAndUpdate({ user_id }, { items: [] }, { new: true })
  }
}

module.exports = new CartRepository()
