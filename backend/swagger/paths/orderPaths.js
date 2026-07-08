module.exports = {
  '/orders': {
    get: {
      tags: ['Orders'],
      summary: 'List all orders',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of orders',
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
            }
          }
        },
        '401': { description: 'Unauthorized' }
      }
    },
    post: {
      tags: ['Orders'],
      summary: 'Create a new order',
      security: [{ bearerAuth: [] }],
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
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/orders/user/{userId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get orders by user ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
      ],
      responses: {
        '200': {
          description: 'List of user orders',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } // Đã sửa ở đây
        },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/orders/{id}/status': {
    put: {
      tags: ['Orders'],
      summary: 'Update order status',
      security: [{ bearerAuth: [] }],
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
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/orders/{id}': {
    get: {
      tags: ['Orders'],
      summary: 'Get order by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ID' }
      ],
      responses: {
        '200': {
          description: 'Order retrieved successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } // Đã sửa ở đây
        },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Order not found' }
      }
    },
    put: {
      tags: ['Orders'],
      summary: 'Update order',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ID to update' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Order' }
          }
        }
      },
      responses: {
        '200': { description: 'Order updated successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    },
    delete: {
      tags: ['Orders'],
      summary: 'Delete an existing order',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ID to delete' }
      ],
      responses: {
        '200': { description: 'Order deleted successfully' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Order not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};