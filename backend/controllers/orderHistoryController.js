// OrderHistory Controller
// Handles order history tracking
const OrderHistory = require('../models/OrderHistory')

async function getOrderHistory(req, res) {
  try {
    const { user_id } = req.query
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    const history = await OrderHistory.find({ user_id }).lean()
    res.json(history)
  } catch (err) {
    console.error('❌ Fetch order history error:', err)
    res.status(500).json({ error: 'Could not fetch order history' })
  }
}

async function addOrderHistory(req, res) {
  try {
    const { user_id, order_id, action } = req.body
    if (!user_id || !order_id || !action) {
      return res.status(400).json({ error: 'user_id, order_id, and action are required' })
    }

    const newHistory = new OrderHistory({ user_id, order_id, action })
    await newHistory.save()
    res.status(201).json(newHistory)
  } catch (err) {
    console.error('❌ Add order history error:', err)
    res.status(500).json({ error: 'Could not add order history' })
  }
}

module.exports = { getOrderHistory, addOrderHistory }
