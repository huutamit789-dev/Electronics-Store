// Payment Controller
// Handles payment operations
const Payment = require('../models/Payment')

async function createPayment(req, res) {
  try {
    const { order_id, user_id, amount, payment_method, status } = req.body
    if (!order_id || !user_id || !amount || !payment_method) {
      return res.status(400).json({ error: 'order_id, user_id, amount, and payment_method are required' })
    }

    const newPayment = new Payment({ order_id, user_id, amount, payment_method, status: status || 'pending' })
    await newPayment.save()
    res.status(201).json(newPayment)
  } catch (err) {
    console.error('❌ Create payment error:', err)
    res.status(500).json({ error: 'Could not create payment' })
  }
}

async function getPayments(req, res) {
  try {
    const payments = await Payment.find().lean()
    res.json(payments)
  } catch (err) {
    console.error('❌ Fetch payments error:', err)
    res.status(500).json({ error: 'Could not fetch payments' })
  }
}

module.exports = { createPayment, getPayments }
