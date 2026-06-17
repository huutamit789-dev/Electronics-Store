const PaymentService = require('../services/PaymentService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all payment records.
 * @route GET /payments
 * @access Public
 */
const getPayments = asyncHandler(async (req, res) => {
   const currentUser = req.user; 
  console.log('Current user  controller:', currentUser); 
  const payments = await PaymentService.getAllPayments(currentUser)
  res.success(payments, 'Payments returned successfully')
})

/**
 * @desc Create a new payment record for an order.
 * @route POST /payments
 * @access Public
 */
const createPayment = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  console.log('Current user  controller:', currentUser);
  const newPayment = await PaymentService.createPayment(req.body, currentUser);
  res.success(newPayment, 'Payment created successfully', 201)
})

module.exports = { getPayments, createPayment }
