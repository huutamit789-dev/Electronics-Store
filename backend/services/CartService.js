// Cart Service
// Handles business logic and validation for cart operations
const CartRepository = require('../repositories/CartRepository')

class CartService {
  // Get cart for a user
  async getCart(user_id) {
    if (!user_id) {
      const error = new Error('user_id is required')
      error.status = 400
      throw error
    }

    const cart = await CartRepository.findByUserId(user_id)
    return cart || { user_id, items: [] }
  }

  // Add item to cart
  async addToCart(user_id, product_id, quantity) {
    // Validation
    if (!user_id || !product_id || !quantity) {
      const error = new Error('user_id, product_id, and quantity are required')
      error.status = 400
      throw error
    }

    if (quantity <= 0) {
      const error = new Error('quantity must be greater than 0')
      error.status = 400
      throw error
    }

    // Business logic
    let cart = await CartRepository.findByUserIdFull(user_id)
    if (!cart) {
      cart = await CartRepository.create(user_id)
    }

    const existingItem = cart.items.find(item => item.product_id.toString() === product_id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product_id, quantity })
    }

    const updatedCart = await CartRepository.update(cart)
    return updatedCart.populate('items.product_id')
  }

  // Remove item from cart
  async removeFromCart(user_id, product_id) {
    // Validation
    if (!user_id || !product_id) {
      const error = new Error('user_id and product_id are required')
      error.status = 400
      throw error
    }

    // Business logic
    const cart = await CartRepository.findByUserIdFull(user_id)
    if (!cart) {
      const error = new Error('Cart not found')
      error.status = 404
      throw error
    }

    cart.items = cart.items.filter(item => item.product_id.toString() !== product_id)
    const updatedCart = await CartRepository.update(cart)
    return updatedCart.populate('items.product_id')
  }

  // Update item quantity in cart
  async updateItemQuantity(user_id, product_id, quantity) {
    // Validation
    if (!user_id || !product_id || quantity === undefined) {
      const error = new Error('user_id, product_id, and quantity are required')
      error.status = 400
      throw error
    }

    if (quantity < 0) {
      const error = new Error('quantity cannot be negative')
      error.status = 400
      throw error
    }

    // Business logic
    const cart = await CartRepository.findByUserIdFull(user_id)
    if (!cart) {
      const error = new Error('Cart not found')
      error.status = 404
      throw error
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product_id.toString() !== product_id)
    } else {
      const item = cart.items.find(item => item.product_id.toString() === product_id)
      if (!item) {
        const error = new Error('Item not found in cart')
        error.status = 404
        throw error
      }
      item.quantity = quantity
    }

    const updatedCart = await CartRepository.update(cart)
    return updatedCart.populate('items.product_id')
  }

  // Clear cart
  async clearCart(user_id) {
    if (!user_id) {
      const error = new Error('user_id is required')
      error.status = 400
      throw error
    }

    return await CartRepository.clearItems(user_id)
  }
}

module.exports = new CartService()
