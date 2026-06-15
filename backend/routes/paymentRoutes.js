// Payment Routes
const express = require('express')
const { createPayment, getPayments } = require('../controllers/paymentController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getPayments)
router.post('/', authMiddleware, createPayment)

module.exports = router
