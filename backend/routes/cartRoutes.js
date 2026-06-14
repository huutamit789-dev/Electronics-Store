// Cart Routes
const express = require('express')
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController')

const router = express.Router()

router.get('/', getCart)
router.post('/add', addToCart)
router.post('/remove', removeFromCart)

module.exports = router
