// Order Routes
const express = require('express')
const { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orderController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getOrders)
router.get('/:id', authMiddleware, getOrderById)
router.post('/', authMiddleware, createOrder)
router.put('/:id/status', authMiddleware, updateOrderStatus)
router.delete('/:id', authMiddleware, deleteOrder) 

module.exports = router
