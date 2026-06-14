// Payment Routes
const express = require('express')
const { createPayment, getPayments } = require('../controllers/paymentController')

const router = express.Router()

router.get('/', getPayments)
router.post('/', createPayment)

module.exports = router
