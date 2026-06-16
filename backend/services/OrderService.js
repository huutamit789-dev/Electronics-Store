const OrderRepository = require('../repositories/OrderRepository')

const VALID_STATUSES = ['pending', 'completed', 'cancelled']

class OrderService {
  
  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

  async getAllOrders(page = 1, limit = 10) {
    try {
      return await OrderRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllOrders]:', error);
      throw new Error('Lỗi khi lấy danh sách đơn hàng');
    }
  }

  async getOrderById(id) {
    if (!id) this._throwError('Order ID is required', 400);

    try {
      const order = await OrderRepository.findById(id);
      if (!order) this._throwError('Order not found', 404);
      return order;
    } catch (error) {
      console.error(`Service Error [getOrderById - ${id}]:`, error);
      // Nếu lỗi là do chúng ta chủ động ném ra (404), hãy giữ nguyên
      if (error.status === 404) throw error;
      throw new Error('Lỗi khi lấy thông tin đơn hàng');
    }
  }

  async createOrder(orderData) {
    const { user_id, items, total_price } = orderData;

    // Validation
    if (!user_id || !items || !total_price) this._throwError('Thông tin đơn hàng không đầy đủ', 400);
    if (!Array.isArray(items) || items.length === 0) this._throwError('Items phải là mảng không rỗng', 400);
    if (total_price <= 0) this._throwError('Tổng tiền phải > 0', 400);

    try {
      return await OrderRepository.create(orderData);
    } catch (error) {
      console.error('Service Error [createOrder]:', error);
      throw new Error('Không thể tạo đơn hàng');
    }
  }

  async updateOrderStatus(id, status) {
    if (!id || !status) this._throwError('Thiếu thông tin cập nhật', 400);
    if (!VALID_STATUSES.includes(status)) this._throwError(`Status không hợp lệ. Chỉ chấp nhận: ${VALID_STATUSES.join(', ')}`, 400);

    try {
      const updated = await OrderRepository.updateStatus(id, status);
      if (!updated) this._throwError('Không tìm thấy đơn hàng để cập nhật', 404);
      return updated;
    } catch (error) {
      console.error(`Service Error [updateOrderStatus - ${id}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  }
}

module.exports = new OrderService()