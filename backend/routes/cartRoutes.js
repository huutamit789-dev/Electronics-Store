// Cart Routes
const express = require('express')
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getCart)
router.post('/add', authMiddleware, addToCart)
router.post('/remove', authMiddleware, removeFromCart)
router.put('/update', authMiddleware, updateCartItem)
router.post('/clear', authMiddleware, clearCart)

module.exports = router
