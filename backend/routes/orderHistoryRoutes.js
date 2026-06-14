// OrderHistory Routes
const express = require('express')
const { getOrderHistory, addOrderHistory } = require('../controllers/orderHistoryController')

const router = express.Router()

router.get('/', getOrderHistory)
router.post('/', addOrderHistory)

module.exports = router
