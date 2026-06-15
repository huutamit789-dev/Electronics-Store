module.exports = {
  OrderItem: {
    type: 'object',
    required: ['product_id', 'quantity'],
    properties: {
      product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      quantity: { type: 'integer', example: 2 }
    }
  },
  Order: {
    type: 'object',
    required: ['user_id', 'items', 'total_price'],
    properties: {
      user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
      total_price: { type: 'number', example: 2999.98 },
      status: { type: 'string', example: 'pending', enum: ['pending', 'completed', 'cancelled'] },
      created_at: { type: 'string', format: 'date-time' }
    }
  },
  OrderHistory: {
    type: 'object',
    required: ['order_id'],
    properties: {
      order_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      old_status: { type: 'string', example: 'pending' },
      new_status: { type: 'string', example: 'completed' },
      changed_at: { type: 'string', format: 'date-time' },
      note: { type: 'string', example: 'Order shipped successfully' }
    }
  }
};