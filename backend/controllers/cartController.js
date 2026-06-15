const CartService = require('../services/CartService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get a user's cart by user_id query parameter.
 * @route GET /cart?user_id=:userId
 * @access Public
 */
const getCart = asyncHandler(async (req, res) => {
  const { user_id } = req.query
  const cart = await CartService.getCart(user_id)
  res.success(cart, 'Cart returned successfully')
})

/**
 * @desc Add a product item to a user's cart.
 * @route POST /cart/add
 * @access Public
 */
const addToCart = asyncHandler(async (req, res) => {
  const { user_id, product_id, quantity } = req.body
  const cart = await CartService.addToCart(user_id, product_id, quantity)
  res.success(cart, 'Item added to cart successfully')
})

/**
 * @desc Remove a product item from a user's cart.
 * @route POST /cart/remove
 * @access Public
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.body
  const cart = await CartService.removeFromCart(user_id, product_id)
  res.success(cart, 'Item removed from cart successfully')
})

/**
 * @desc Update the quantity of a product item in a user's cart.
 * @route PUT /cart/update
 * @access Public
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { user_id, product_id, quantity } = req.body
  const cart = await CartService.updateItemQuantity(user_id, product_id, quantity)
  res.success(cart, 'Cart item updated successfully')
})

/**
 * @desc Clear all items from a user's cart.
 * @route POST /cart/clear
 * @access Public
 */
const clearCart = asyncHandler(async (req, res) => {
  const { user_id } = req.body
  const cart = await CartService.clearCart(user_id)
  res.success(cart, 'Cart cleared successfully')
})

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart }
