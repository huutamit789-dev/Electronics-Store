// Cart Controller
// Handles shopping cart operations
const Cart = require('../models/Cart')

async function getCart(req, res) {
  try {
    const { user_id } = req.query
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    const cart = await Cart.findOne({ user_id }).populate('items.product_id').lean()
    res.json(cart || { user_id, items: [] })
  } catch (err) {
    console.error('❌ Fetch cart error:', err)
    res.status(500).json({ error: 'Could not fetch cart' })
  }
}

async function addToCart(req, res) {
  try {
    const { user_id, product_id, quantity } = req.body
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ error: 'user_id, product_id, and quantity are required' })
    }

    let cart = await Cart.findOne({ user_id })
    if (!cart) {
      cart = new Cart({ user_id, items: [] })
    }

    const existingItem = cart.items.find(item => item.product_id.toString() === product_id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product_id, quantity })
    }

    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('❌ Add to cart error:', err)
    res.status(500).json({ error: 'Could not add to cart' })
  }
}

async function removeFromCart(req, res) {
  try {
    const { user_id, product_id } = req.body
    const cart = await Cart.findOne({ user_id })
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = cart.items.filter(item => item.product_id.toString() !== product_id)
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('❌ Remove from cart error:', err)
    res.status(500).json({ error: 'Could not remove from cart' })
  }
}

module.exports = { getCart, addToCart, removeFromCart }
