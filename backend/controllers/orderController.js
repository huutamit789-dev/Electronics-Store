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
 * @desc Get orders by user ID.
 * @route GET /orders/user/:userId
 * @access Public
 */
const getOrdersByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const orders = await OrderService.getOrdersByUserId(userId)
  res.success(orders, 'Orders returned successfully')
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

/**
 * @desc Update an order by order ID.
 * @route PUT /orders/:id
 * @access Public
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const updated = await OrderService.updateOrder(id, req.body)
  res.success(updated, 'Order updated successfully')
})

/**
 * @desc Delete an order by order ID.
 * @route DELETE /orders/:id
 * @access Public
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  const orderIdToDelete = req.params.id;

  const result = await OrderService.deleteOrder(currentUser, orderIdToDelete);

  res.success(result, 'Order deleted successfully');
});

module.exports = { getOrders, getOrderById, getOrdersByUserId, createOrder, updateOrderStatus, updateOrder, deleteOrder }
