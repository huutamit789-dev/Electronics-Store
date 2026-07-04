// Payment Routes
const express = require('express')
const { createPayment, getPayments } = require('../controllers/paymentController')
const { authMiddleware } = require('../middleware/authMiddleware')
const Payment = require('../models/PaymentModel')
const OrderHistoryService = require('../services/OrderHistoryService')
const Order = require('../models/OrderModel')

const router = express.Router()

router.get('/', authMiddleware, getPayments)
router.post('/', authMiddleware, createPayment)
router.post('/momo/sandbox', authMiddleware, async (req, res) => {
  const { amount, orderId, orderInfo } = req.body || {}

  if (!amount || !orderId) {
    return res.status(400).json({ success: false, message: 'amount và orderId là bắt buộc' })
  }

  const sandboxPayload = {
    success: true,
    message: 'MoMo sandbox payment initialized',
    data: {
      payUrl: `https://developers.momo.vn/v3/checkout?amount=${amount}&orderId=${encodeURIComponent(orderId)}&orderInfo=${encodeURIComponent(orderInfo || 'ElectroStore test payment')}`,
      amount,
      orderId,
      partnerCode: 'MOMO_SANDBOX',
      requestId: `${orderId}-request`
    }
  }

  return res.json(sandboxPayload)
})

// MoMo callback endpoint - nhận kết quả từ MoMo sau khi khách hàng thanh toán
router.post('/momo/callback', async (req, res) => {
  try {
    const { orderId, resultCode, message, transId, amount } = req.body || {}

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId là bắt buộc' })
    }

    // Tìm order bằng momo_order_id
    const order = await Order.findOne({ momo_order_id: orderId })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    // Xác định trạng thái payment
    const paymentStatus = resultCode === 0 ? 'paid' : 'failed'
    const orderStatus = resultCode === 0 ? 'completed' : 'cancelled'

    // Cập nhật hoặc tạo payment record
    await Payment.findOneAndUpdate(
      { order_id: order._id },
      {
        payment_method: 'momo',
        payment_status: paymentStatus,
        transaction_id: transId,
        amount: amount,
        paid_at: resultCode === 0 ? new Date() : null
      },
      { upsert: true, new: true }
    )

    // Lưu vào orderhistory
    const oldStatus = order.status
    order.status = orderStatus
    await order.save()

    await OrderHistoryService.createOrderHistory({
      order_id: order._id,
      old_status: oldStatus,
      new_status: orderStatus,
      note: resultCode === 0 
        ? `Thanh toán MoMo thành công. Mã giao dịch: ${transId}` 
        : `Thanh toán MoMo thất bại. Lỗi: ${message || 'Unknown error'}`
    })

    return res.json({
      success: resultCode === 0,
      message: resultCode === 0 ? 'Thanh toán thành công' : 'Thanh toán thất bại',
      data: {
        orderId,
        paymentStatus,
        orderStatus,
        transId,
        amount
      }
    })
  } catch (error) {
    console.error('MoMo callback error:', error)
    return res.status(500).json({ success: false, message: 'Lỗi xử lý callback' })
  }
})

// Endpoint để test kết quả payment (giả lập callback)
router.post('/momo/test-result', authMiddleware, async (req, res) => {
  try {
    const { orderId, success: isSuccess, amount } = req.body || {}

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId là bắt buộc' })
    }

    // Tìm order bằng momo_order_id
    const order = await Order.findOne({ momo_order_id: orderId })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    // Giả lập kết quả
    const resultCode = isSuccess ? 0 : 1
    const transId = isSuccess ? `TEST_${Date.now()}` : null
    const paymentStatus = isSuccess ? 'paid' : 'failed'
    const orderStatus = isSuccess ? 'completed' : 'cancelled'

    // Cập nhật payment
    await Payment.findOneAndUpdate(
      { order_id: order._id },
      {
        payment_method: 'momo',
        payment_status: paymentStatus,
        transaction_id: transId,
        amount: amount || order.total_price,
        paid_at: isSuccess ? new Date() : null
      },
      { upsert: true, new: true }
    )

    // Lưu vào orderhistory
    const oldStatus = order.status
    order.status = orderStatus
    await order.save()

    await OrderHistoryService.createOrderHistory({
      order_id: order._id,
      old_status: oldStatus,
      new_status: orderStatus,
      note: isSuccess 
        ? `Thanh toán MoMo thành công (TEST). Mã giao dịch: ${transId}` 
        : `Thanh toán MoMo thất bại (TEST)`
    })

    return res.json({
      success: isSuccess,
      message: isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại',
      data: {
        orderId,
        paymentStatus,
        orderStatus,
        transId,
        amount: amount || order.total_price
      }
    })
  } catch (error) {
    console.error('MoMo test result error:', error)
    return res.status(500).json({ success: false, message: 'Lỗi xử lý test result' })
  }
})

module.exports = router
