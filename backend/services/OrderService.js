const OrderRepository = require('../repositories/OrderRepository');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');
const emailService = require('../services/emailService');
const TransactionService = require('../services/TransactionService');

const VALID_STATUSES = ['pending', 'completed', 'cancelled'];

class OrderService {
  async getAllOrders(page = 1, limit = 10) {
    return await OrderRepository.findAll(page, limit);
  }

  async getOrderById(id) {
    if (!id) throw new Error('Order ID is required');

    const order = await OrderRepository.findById(id);
    if (!order) throw new Error('Order not found');

    return order;
  }

  async getOrdersByUserId(userId) {
    if (!userId) throw new Error('User ID is required');

    const orders = await OrderRepository.findByUserId(userId);
    return orders;
  }

  /**
   * @function createOrder
   * @description Creates a new order. If a coupon code is supplied, it is validated, 
   * the discount is calculated, the final price is enforced, and the coupon uses counter is incremented.
   * @param {Object} orderData - The order attributes from req.body.
   * @returns {Promise<Object>} Created order details.
   */
  async createOrder(orderData) {
    const { user_id, items, total_price, coupon_code, payment_method } = orderData;

    // Validation
    if (!user_id || !items || !total_price) throw new Error('Thông tin đơn hàng không đầy đủ');
    if (!Array.isArray(items) || items.length === 0) throw new Error('Items phải là mảng không rỗng');
    if (total_price <= 0) throw new Error('Tổng tiền phải > 0');

    let originalPrice = total_price;
    let discountAmount = 0;
    let finalPrice = total_price;

    // Áp dụng mã giảm giá nếu có
    if (coupon_code) {
      const Coupon = require('../models/CouponModel');
      const coupon = await Coupon.findOne({ code: coupon_code.toUpperCase() });
      if (!coupon) throw new Error('Mã giảm giá không tồn tại');
      if (!coupon.is_active) throw new Error('Mã giảm giá đã bị vô hiệu hóa');
      
      const now = new Date();
      if (new Date(coupon.expiration_date) < now) throw new Error('Mã giảm giá đã hết hạn sử dụng');
      
      if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
        throw new Error('Mã giảm giá đã đạt giới hạn sử dụng tối đa');
      }

      const clientOriginalPrice = orderData.original_price || total_price;
      if (clientOriginalPrice < coupon.min_order_value) {
        throw new Error(`Đơn hàng tối thiểu phải từ ${coupon.min_order_value.toLocaleString()}đ để sử dụng mã này`);
      }

      originalPrice = clientOriginalPrice;

      if (coupon.discount_type === 'percentage') {
        discountAmount = (originalPrice * coupon.discount_value) / 100;
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
      } else if (coupon.discount_type === 'fixed') {
        discountAmount = coupon.discount_value;
      }

      if (discountAmount > originalPrice) {
        discountAmount = originalPrice;
      }

      finalPrice = originalPrice - discountAmount;

      // Lưu tăng lượt sử dụng
      coupon.uses_count += 1;
      await coupon.save();
    }

    const finalOrderData = {
      ...orderData,
      total_price: finalPrice,
      original_price: originalPrice,
      discount_amount: discountAmount,
      coupon_code: coupon_code ? coupon_code.toUpperCase() : null
    };

    const created = await OrderRepository.create(finalOrderData);
    
    // Nếu thanh toán bằng tài khoản, trừ tiền và cập nhật VIP
    if (payment_method === 'balance') {
      try {
        await TransactionService.deductForPurchase(
          user_id, 
          finalPrice, 
          created._id, 
          `Thanh toán đơn hàng #${created._id}`
        );
      } catch (error) {
        // Nếu trừ tiền thất bại, hủy đơn hàng
        await OrderRepository.delete(created._id);
        throw error;
      }
    }
    
    // Populate user email for notification
    const populated = await Order.findById(created._id).populate('user_id', 'email');
    // Send emails to customer and admin
    if (populated.user_id && populated.user_id.email) {
      await emailService.sendOrderConfirmation(populated.user_id.email, populated);
    }
    await emailService.sendOrderNotificationToAdmin(populated);
    return created;
  }

  async updateOrderStatus(id, status) {
    if (!id || !status) throw new Error('Thiếu thông tin cập nhật');
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Status không hợp lệ. Chỉ chấp nhận: ${VALID_STATUSES.join(', ')}`);
    }

    const order = await Order.findById(id);
    if (!order) throw new Error('Không tìm thấy đơn hàng để cập nhật');

    // Nếu hủy đơn hàng và đơn hàng đã thanh toán bằng balance, hoàn tiền
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const user = await User.findById(order.user_id);
      if (user && order.payment_method === 'balance') {
        await TransactionService.refundMoney(
          order.user_id,
          order.total_price,
          order._id,
          `Hoàn tiền đơn hàng #${order._id}`
        );
      }
    }

    const updated = await OrderRepository.updateStatus(id, status);
    if (!updated) throw new Error('Không tìm thấy đơn hàng để cập nhật');
    // Fetch full order with populated user for email notifications
    const fullOrder = await Order.findById(id).populate('user_id', 'email');
    // Notify customer about status change
    if (fullOrder.user_id && fullOrder.user_id.email) {
      await emailService.sendStatusUpdate(fullOrder.user_id.email, fullOrder);
    }
    // Notify admin as well
    await emailService.sendOrderNotificationToAdmin(fullOrder);
    
    return updated;
  }

  async updateOrder(id, updateData) {
    if (!id) throw new Error('Order ID is required');
    
    const updated = await OrderRepository.update(id, updateData);
    if (!updated) throw new Error('Không tìm thấy đơn hàng để cập nhật');
    
    return updated;
  }

    async deleteOrder(currentUser, orderIdToDelete) {
        // 1. Kiểm tra quyền Admin
        if (!currentUser || currentUser.role !== 'admin') {
          const error = new Error('Bạn không có quyền thực hiện hành động này');
          error.status = 403;
          throw error;
        }
        // 3. Thực hiện xóa
        const deletedOrder = await OrderRepository.delete(orderIdToDelete);
        if (!deletedOrder) {
          const error = new Error('Đơn hàng không tồn tại');
          error.status = 404;
          throw error;
        }
}
}
module.exports = new OrderService();