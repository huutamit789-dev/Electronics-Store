// Order Controller
// Handles HTTP requests and responses for order operations
// Delegates business logic to OrderService
const OrderService = require('../services/OrderService')

async function getOrders(req, res, next) {
  try {
    const orders = await OrderService.getAllOrders()
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

async function createOrder(req, res, next) {
  try {
    const newOrder = await OrderService.createOrder(req.body)
    res.status(201).json(newOrder)
  } catch (err) {
    next(err)
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    const updated = await OrderService.updateOrderStatus(id, status)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

module.exports = { getOrders, createOrder, updateOrderStatus }
