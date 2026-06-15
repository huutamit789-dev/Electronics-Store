// Cart Controller
// Handles HTTP requests and responses for cart operations
// Delegates business logic to CartService
const CartService = require('../services/CartService')

async function getCart(req, res, next) {
  try {
    const { user_id } = req.query
    const cart = await CartService.getCart(user_id)
    res.json(cart)
  } catch (err) {
    next(err)
  }
}

async function addToCart(req, res, next) {
  try {
    const { user_id, product_id, quantity } = req.body
    const cart = await CartService.addToCart(user_id, product_id, quantity)
    res.json(cart)
  } catch (err) {
    next(err)
  }
}

async function removeFromCart(req, res, next) {
  try {
    const { user_id, product_id } = req.body
    const cart = await CartService.removeFromCart(user_id, product_id)
    res.json(cart)
  } catch (err) {
    next(err)
  }
}

// Additional endpoint: update item quantity
async function updateCartItem(req, res, next) {
  try {
    const { user_id, product_id, quantity } = req.body
    const cart = await CartService.updateItemQuantity(user_id, product_id, quantity)
    res.json(cart)
  } catch (err) {
    next(err)
  }
}

// Additional endpoint: clear cart
async function clearCart(req, res, next) {
  try {
    const { user_id } = req.body
    const cart = await CartService.clearCart(user_id)
    res.json(cart)
  } catch (err) {
    next(err)
  }
}

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart }
