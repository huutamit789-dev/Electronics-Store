// Payment Controller
// Handles HTTP requests and responses for payment operations
// Delegates business logic to PaymentService
const PaymentService = require('../services/PaymentService')

async function getPayments(req, res, next) {
  try {
    const payments = await PaymentService.getAllPayments()
    res.json(payments)
  } catch (err) {
    next(err)
  }
}

async function createPayment(req, res, next) {
  try {
    const newPayment = await PaymentService.createPayment(req.body)
    res.status(201).json(newPayment)
  } catch (err) {
    next(err)
  }
}

module.exports = { getPayments, createPayment }
