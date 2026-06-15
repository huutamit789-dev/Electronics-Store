// OrderHistory Controller
// Handles HTTP requests and responses for order history operations
// Delegates business logic to OrderHistoryService
const OrderHistoryService = require('../services/OrderHistoryService')

async function getOrderHistory(req, res, next) {
  try {
    const history = await OrderHistoryService.getAllOrderHistory()
    res.json(history)
  } catch (err) {
    next(err)
  }
}

async function addOrderHistory(req, res, next) {
  try {
    const newHistory = await OrderHistoryService.addOrderHistory(req.body)
    res.status(201).json(newHistory)
  } catch (err) {
    next(err)
  }
}

module.exports = { getOrderHistory, addOrderHistory }
