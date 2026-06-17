const OrderHistoryService = require('../services/OrderHistoryService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all order history entries.
 * @route GET /order-history
 * @access Public
 */
const getOrderHistory = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  console.log('Current user  controller:', currentUser); 
  const history = await OrderHistoryService.getOrderHistory(currentUser)
  res.success(history, 'Order history returned successfully')
})

module.exports = { getOrderHistory }
