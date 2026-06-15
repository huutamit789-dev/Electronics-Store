const OrderService = require('../services/OrderService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all orders with user and product data.
 * @route GET /orders
 * @access Public
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderService.getAllOrders()
  res.success(orders, 'Orders returned successfully')
})

/**
 * @desc Get order detail by ID.
 * @route GET /orders/:id
 * @access Public
 */
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const order = await OrderService.getOrderById(id)
  res.success(order, 'Order returned successfully')
})

/**
 * @desc Create a new order.
 * @route POST /orders
 * @access Public
 */
const createOrder = asyncHandler(async (req, res) => {
  const newOrder = await OrderService.createOrder(req.body)
  res.success(newOrder, 'Order created successfully', 201)
})

/**
 * @desc Update an order status by order ID.
 * @route PUT /orders/:id/status
 * @access Public
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const updated = await OrderService.updateOrderStatus(id, status)
  res.success(updated, 'Order status updated successfully')
})

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus }
