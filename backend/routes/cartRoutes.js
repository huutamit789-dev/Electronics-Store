const express = require('express');
const router = express.Router();
const cartService = require('../services/CartService'); // Adjust path if necessary

// POST /api/cart/add - Add item to cart
router.post('/add', async (req, res) => {
  try {
    // Extract data from request body, including price
    const { userId, productId, quantity, price } = req.body;

    // Validate basic input
    if (!userId || !productId || !quantity || price === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields: userId, productId, quantity, and price.' });
    }

    // Call the service to add the item to the cart
    const updatedCart = await cartService.addToCart(userId, productId, quantity, price);

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully!',
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    // Differentiate between validation errors and other server errors
    if (error.message.includes('Thiếu thông tin bắt buộc') || error.message.includes('Số lượng phải > 0') || error.message.includes('Giá không hợp lệ')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET /api/cart/:userId - Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }
    const cart = await cartService.getCart(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'Missing required fields: userId, productId.' });
    }
    const updatedCart = await cartService.removeFromCart(userId, productId);
    res.status(200).json({ success: true, message: 'Product removed from cart.', data: updatedCart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// PUT /api/cart/update-quantity - Update item quantity in cart
router.put('/update-quantity', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields: userId, productId, quantity.' });
    }
    const updatedCart = await cartService.updateItemQuantity(userId, productId, quantity);
    res.status(200).json({ success: true, message: 'Cart item quantity updated.', data: updatedCart });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    if (error.message.includes('Số lượng không hợp lệ') || error.message.includes('Sản phẩm không có trong giỏ')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// DELETE /api/cart/clear/:userId - Clear user's cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }
    const clearedCart = await cartService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared successfully.', data: clearedCart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


module.exports = router;