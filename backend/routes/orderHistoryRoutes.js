// OrderHistory Routes
const express = require('express')
const { getOrderHistory, addOrderHistory } = require('../controllers/orderHistoryController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getOrderHistory)
router.post('/', authMiddleware, addOrderHistory)

module.exports = router
