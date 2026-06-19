const CartRepository = require('../repositories/CartRepository');

class CartService {
  async getCart(user_id) {
    if (!user_id) throw new Error('user_id is required');
    
    const cart = await CartRepository.findByUserId(user_id);
    return cart || { user_id, items: [] };
  }

  async addToCart(user_id, product_id, quantity, price) { // Added 'price' parameter
    if (!user_id || !product_id || !quantity || price === undefined) throw new Error('Thiếu thông tin bắt buộc'); // Added price check
    if (quantity <= 0) throw new Error('Số lượng phải > 0');
    if (price < 0) throw new Error('Giá không hợp lệ'); // Optional: Add price validation

    let cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) cart = await CartRepository.create(user_id);

    const existingItem = cart.items.find(item => item.product_id.toString() === product_id);
    if (existingItem) {
      existingItem.quantity += quantity;
      // Optionally update price if it can change, or keep the original price
      // existingItem.price = price; 
    } else {
      cart.items.push({ product_id, quantity, price }); // Added 'price' to the new item
    }

    const updatedCart = await CartRepository.update(cart);
    return await updatedCart.populate('items.product_id');
  }

  async removeFromCart(user_id, product_id) {
    if (!user_id || !product_id) throw new Error('Thiếu thông tin bắt buộc');

    const cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) throw new Error('Giỏ hàng không tồn tại');

    cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
    const updatedCart = await CartRepository.update(cart);
    return await updatedCart.populate('items.product_id');
  }

  async updateItemQuantity(user_id, product_id, quantity) {
    if (!user_id || !product_id || quantity === undefined) throw new Error('Thiếu thông tin');
    if (quantity < 0) throw new Error('Số lượng không hợp lệ');

    const cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) throw new Error('Giỏ hàng không tồn tại');

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
    } else {
      const item = cart.items.find(item => item.product_id.toString() === product_id);
      if (!item) throw new Error('Sản phẩm không có trong giỏ');
      item.quantity = quantity;
    }

    const updatedCart = await CartRepository.update(cart);
    return await updatedCart.populate('items.product_id');
  }

  async clearCart(user_id) {
    if (!user_id) throw new Error('user_id is required');
    return await CartRepository.clearItems(user_id);
  }
}

module.exports = new CartService();