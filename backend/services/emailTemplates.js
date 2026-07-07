function formatCurrency(num) {
  return num.toLocaleString('vi-VN') + ' đ';
}

function orderConfirmationTemplate(order) {
  return `
    <h2>✅ Đặt hàng thành công!</h2>
    <p>Mã đơn hàng: <strong>#${order._id}</strong></p>
    <p>Tổng tiền: <strong>${formatCurrency(order.total_price)}</strong></p>
    <p>Chi tiết sẽ được gửi trong email.</p>
  `;
}

function statusUpdateTemplate(order) {
  return `
    <h2>📦 Cập nhật trạng thái đơn hàng</h2>
    <p>Mã đơn hàng: <strong>#${order._id}</strong></p>
    <p>Trạng thái mới: <strong>${order.status.toUpperCase()}</strong></p>
    <p>Tổng tiền: ${formatCurrency(order.total_price)}</p>
  `;
}

function adminOrderNotificationTemplate(order) {
  return `
    <h2>🛒 Đơn hàng mới / Cập nhật</h2>
    <p>Mã: <strong>#${order._id}</strong></p>
    <p>Khách: ${order.user_id?.email || order.user_id}</p>
    <p>Trạng thái: ${order.status}</p>
    <p>Tổng: ${formatCurrency(order.total_price)}</p>
    <p>Thời gian: ${new Date(order.created_at).toLocaleString('vi-VN')}</p>
  `;
}

module.exports = {
  orderConfirmationTemplate,
  statusUpdateTemplate,
  adminOrderNotificationTemplate,
};
