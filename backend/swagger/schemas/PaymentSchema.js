module.exports = {
  Payment: {
    type: 'object',
    required: ['order_id', 'payment_method'],
    properties: {
      order_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      payment_method: { type: 'string', example: 'credit_card', enum: ['cod', 'credit_card', 'momo', 'zalopay'] },
      payment_status: { type: 'string', example: 'pending', enum: ['pending', 'paid', 'failed', 'refunded'] },
      transaction_id: { type: 'string', example: 'txn_123456' },
      amount: { type: 'number', example: 1499.99 },
      paid_at: { type: 'string', format: 'date-time' }
    }
  }
};