const CartRepository = require('../repositories/CartRepository')

class CartService {
  
  // Hàm trợ giúp để ném lỗi nghiệp vụ
  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

  async getCart(user_id) {
    if (!user_id) this._throwError('user_id is required', 400);

    try {
      const cart = await CartRepository.findByUserId(user_id);
      return cart || { user_id, items: [] };
    } catch (error) {
      console.error('Service Error [getCart]:', error);
      throw new Error('Lỗi truy xuất giỏ hàng');
    }
  }

  async addToCart(user_id, product_id, quantity) {
    if (!user_id || !product_id || !quantity) this._throwError('Thiếu thông tin bắt buộc', 400);
    if (quantity <= 0) this._throwError('Số lượng phải > 0', 400);

    try {
      let cart = await CartRepository.findByUserIdFull(user_id);
      if (!cart) cart = await CartRepository.create(user_id);

      const existingItem = cart.items.find(item => item.product_id.toString() === product_id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product_id, quantity });
      }

      const updatedCart = await CartRepository.update(cart);
      return await updatedCart.populate('items.product_id');
    } catch (error) {
      console.error('Service Error [addToCart]:', error);
      throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  }

  async removeFromCart(user_id, product_id) {
    if (!user_id || !product_id) this._throwError('Thiếu thông tin bắt buộc', 400);

    try {
      const cart = await CartRepository.findByUserIdFull(user_id);
      if (!cart) this._throwError('Giỏ hàng không tồn tại', 404);

      cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
      const updatedCart = await CartRepository.update(cart);
      return await updatedCart.populate('items.product_id');
    } catch (error) {
      console.error('Service Error [removeFromCart]:', error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi xóa sản phẩm');
    }
  }

  async updateItemQuantity(user_id, product_id, quantity) {
    if (!user_id || !product_id || quantity === undefined) this._throwError('Thiếu thông tin', 400);
    if (quantity < 0) this._throwError('Số lượng không hợp lệ', 400);

    try {
      const cart = await CartRepository.findByUserIdFull(user_id);
      if (!cart) this._throwError('Giỏ hàng không tồn tại', 404);

      if (quantity === 0) {
        cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
      } else {
        const item = cart.items.find(item => item.product_id.toString() === product_id);
        if (!item) this._throwError('Sản phẩm không có trong giỏ', 404);
        item.quantity = quantity;
      }

      const updatedCart = await CartRepository.update(cart);
      return await updatedCart.populate('items.product_id');
    } catch (error) {
      console.error('Service Error [updateItemQuantity]:', error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi cập nhật giỏ hàng');
    }
  }

  async clearCart(user_id) {
    if (!user_id) this._throwError('user_id is required', 400);
    try {
      return await CartRepository.clearItems(user_id);
    } catch (error) {
      console.error('Service Error [clearCart]:', error);
      throw new Error('Lỗi xóa toàn bộ giỏ hàng');
    }
  }
}

module.exports = new CartService()