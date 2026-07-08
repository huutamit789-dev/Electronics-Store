module.exports = {
  '/order-history': {
    get: {
      tags: ['OrderHistory'],
      summary: 'List all order history entries',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of order history entries',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/OrderHistory' } } } }
        },
        '401': { description: 'Unauthorized' }
      }
    },
    post: {
      tags: ['OrderHistory'],
      summary: 'Create order history entry',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/OrderHistory' }
          }
        }
      },
      responses: {
        '201': { description: 'Order history entry created successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};