// OrderHistory Routes
const express = require('express')
const { getOrderHistory } = require('../controllers/orderHistoryController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getOrderHistory)

module.exports = router
