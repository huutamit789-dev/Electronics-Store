module.exports = {
  Review: {
    type: 'object',
    required: ['user_id', 'product_id', 'rating'],
    properties: {
      user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
      rating: { type: 'integer', example: 5, minimum: 1, maximum: 5 },
      comment: { type: 'string', example: 'Great product and fast delivery!' },
      created_at: { type: 'string', format: 'date-time' }
    }
  }
};