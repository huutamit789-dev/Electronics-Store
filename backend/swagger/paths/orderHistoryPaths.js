   module.exports = {
 '/order-history': {
      get: {
        tags: ['OrderHistory'],
        summary: 'List all order history entries',
        responses: {
          '200': {
            description: 'List of order history entries',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/OrderHistory' } } } }
          }
        }
      },
    }
}