const OrderHistoryService = require('../services/OrderHistoryService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all order history entries.
 * @route GET /order-history
 * @access Public
 */
const getOrderHistory = asyncHandler(async (req, res) => {
  const history = await OrderHistoryService.getAllOrderHistory()
  res.success(history, 'Order history returned successfully')
})

/**
 * @desc Add a new order history entry.
 * @route POST /order-history
 * @access Public
 */
const addOrderHistory = asyncHandler(async (req, res) => {
  const newHistory = await OrderHistoryService.addOrderHistory(req.body)
  res.success(newHistory, 'Order history created successfully', 201)
})

module.exports = { getOrderHistory, addOrderHistory }
