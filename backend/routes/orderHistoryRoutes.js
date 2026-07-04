// OrderHistory Routes
const express = require('express')
const { getOrderHistory, createOrderHistory } = require('../controllers/orderHistoryController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getOrderHistory)
router.post('/', createOrderHistory)

module.exports = router
