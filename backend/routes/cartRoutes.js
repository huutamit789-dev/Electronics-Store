// Cart Routes
const express = require('express')
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController')

const router = express.Router()

router.get('/', getCart)
router.post('/add', addToCart)
router.post('/remove', removeFromCart)
router.put('/update', updateCartItem)
router.post('/clear', clearCart)

module.exports = router
