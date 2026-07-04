const OrderHistoryService = require('../services/OrderHistoryService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all order history entries.
 * @route GET /order-history
 * @access Public
 */
const getOrderHistory = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const history = await OrderHistoryService.getOrderHistory(currentUser)
  res.success(history, 'Order history returned successfully')
})

/**
 * @desc Create a new order history entry.
 * @route POST /order-history
 * @access Public
 */
const createOrderHistory = asyncHandler(async (req, res) => {
  const { order_id, old_status, new_status, note } = req.body;
  const history = await OrderHistoryService.createOrderHistory({
    order_id,
    old_status,
    new_status,
    note
  });
  res.success(history, 'Order history created successfully')
})

module.exports = { getOrderHistory, createOrderHistory }
