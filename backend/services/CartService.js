const CartRepository = require('../repositories/CartRepository');
const Product = require('../models/ProductModel');

class CartService {
  async getCart(user_id) {
    if (!user_id) throw new Error('user_id is required');
    
    const cart = await CartRepository.findByUserId(user_id);
    return cart || { user_id, items: [] };
  }

  async addToCart(user_id, product_id, quantity, price) {
    if (!user_id || !product_id || !quantity || price === undefined) throw new Error('Thiếu thông tin bắt buộc');
    if (quantity <= 0) throw new Error('Số lượng phải > 0');
    if (price < 0) throw new Error('Giá không hợp lệ');

    // Kiểm tra và trừ số lượng product
    const product = await Product.findById(product_id);
    if (!product) throw new Error('Sản phẩm không tồn tại');
    
    if (product.stock_quantity < quantity) {
      throw new Error(`Sản phẩm chỉ còn ${product.stock_quantity} cái, không đủ ${quantity} cái`);
    }

    // Trừ số lượng product
    product.stock_quantity -= quantity;
    await product.save();

    let cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) cart = await CartRepository.create(user_id);

    const existingItem = cart.items.find(item => item.product_id.toString() === product_id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product_id, quantity, price });
    }

    const updatedCart = await CartRepository.update(cart);
    return await updatedCart.populate('items.product_id');
  }

  async removeFromCart(user_id, product_id) {
    if (!user_id || !product_id) throw new Error('Thiếu thông tin bắt buộc');

    const cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) throw new Error('Giỏ hàng không tồn tại');

    const itemToRemove = cart.items.find(item => item.product_id.toString() === product_id);
    if (!itemToRemove) throw new Error('Sản phẩm không có trong giỏ');

    // Rollback: Cộng lại số lượng product
    const product = await Product.findById(product_id);
    if (product) {
      product.stock_quantity += itemToRemove.quantity;
      await product.save();
    }

    cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
    const updatedCart = await CartRepository.update(cart);
    return await updatedCart.populate('items.product_id');
  }

  async updateItemQuantity(user_id, product_id, quantity) {
    if (!user_id || !product_id || quantity === undefined) throw new Error('Thiếu thông tin');
    if (quantity < 0) throw new Error('Số lượng không hợp lệ');

    const cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) throw new Error('Giỏ hàng không tồn tại');

    const item = cart.items.find(item => item.product_id.toString() === product_id);
    if (!item) throw new Error('Sản phẩm không có trong giỏ');

    const product = await Product.findById(product_id);
    if (!product) throw new Error('Sản phẩm không tồn tại');

    if (quantity === 0) {
      // Rollback: Cộng lại số lượng product khi xóa item
      product.stock_quantity += item.quantity;
      await product.save();
      cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
    } else {
      // Kiểm tra stock nếu tăng số lượng
      if (quantity > item.quantity) {
        const quantityDiff = quantity - item.quantity;
        if (product.stock_quantity < quantityDiff) {
          throw new Error(`Sản phẩm chỉ còn ${product.stock_quantity} cái, không đủ để tăng lên ${quantity} cái`);
        }
        product.stock_quantity -= quantityDiff;
        await product.save();
      } else if (quantity < item.quantity) {
        // Rollback: Cộng lại số lượng khi giảm
        const quantityDiff = item.quantity - quantity;
        product.stock_quantity += quantityDiff;
        await product.save();
      }
      item.quantity = quantity;
    }

    const updatedCart = await CartRepository.update(cart);
    return await updatedCart.populate('items.product_id');
  }

  async clearCart(user_id) {
    if (!user_id) throw new Error('user_id is required');

    const cart = await CartRepository.findByUserIdFull(user_id);
    if (!cart) throw new Error('Giỏ hàng không tồn tại');

    // Rollback: Cộng lại số lượng cho tất cả products
    for (const item of cart.items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        product.stock_quantity += item.quantity;
        await product.save();
      }
    }

    return await CartRepository.clearItems(user_id);
  }
}

module.exports = new CartService();