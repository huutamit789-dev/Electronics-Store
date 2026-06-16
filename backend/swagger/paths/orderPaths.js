   module.exports = {
 '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List all orders',
        responses: {
          '200': {
            description: 'List of orders',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' }
            }
          }
        },
        responses: {
          '201': { description: 'Order created successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/orders/{id}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Update order status',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ID to update status' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', example: 'completed', enum: ['pending', 'completed', 'cancelled'] }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Order status updated successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
           }
      }
    },
      delete: {
      tags: ['orders'],
      summary: 'Delete an existing order',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ID to delete' }
      ],
      responses: {
        '200': { description: 'Order deleted successfully' },
        '404': { description: 'Order not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
};