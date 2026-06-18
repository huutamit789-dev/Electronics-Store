module.exports = {
  CartItem: {
    type: 'object',
    required: ['product_id', 'quantity'],
    properties: {
      product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      quantity: { type: 'integer', example: 3 }
    }
  },
  Cart: {
    type: 'object',
    required: ['user_id', 'items'],
    properties: {
      user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
      updated_at: { type: 'string', format: 'date-time' }
    }
  }
};