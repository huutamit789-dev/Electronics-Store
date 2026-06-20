const OrderRepository = require('../repositories/OrderRepository');

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

  async createOrder(orderData) {
    const { user_id, items, total_price } = orderData;

    // Validation
    if (!user_id || !items || !total_price) throw new Error('Thông tin đơn hàng không đầy đủ');
    if (!Array.isArray(items) || items.length === 0) throw new Error('Items phải là mảng không rỗng');
    if (total_price <= 0) throw new Error('Tổng tiền phải > 0');

    return await OrderRepository.create(orderData);
  }

  async updateOrderStatus(id, status) {
    if (!id || !status) throw new Error('Thiếu thông tin cập nhật');
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Status không hợp lệ. Chỉ chấp nhận: ${VALID_STATUSES.join(', ')}`);
    }

    const updated = await OrderRepository.updateStatus(id, status);
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