// Order Controller
// Handles order-related CRUD operations
const Order = require('../models/Order')

async function getOrders(req, res) {
  try {
    const orders = await Order.find().populate('user_id').populate('items.product_id').lean()
    res.json(orders)
  } catch (err) {
    console.error('❌ Fetch orders error:', err)
    res.status(500).json({ error: 'Could not fetch orders' })
  }
}

async function createOrder(req, res) {
  try {
    const { user_id, items, total_price } = req.body
    if (!user_id || !items || !total_price) {
      return res.status(400).json({ error: 'user_id, items, and total_price are required' })
    }

    const newOrder = new Order({ user_id, items, total_price })
    await newOrder.save()
    res.status(201).json(newOrder)
  } catch (err) {
    console.error('❌ Create order error:', err)
    res.status(500).json({ error: 'Could not create order' })
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true })
    res.json(updated)
  } catch (err) {
    console.error('❌ Update order error:', err)
    res.status(500).json({ error: 'Could not update order' })
  }
}

module.exports = { getOrders, createOrder, updateOrderStatus }
