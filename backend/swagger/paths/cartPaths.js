module.exports = {
  '/cart/{userId}': {
    get: {
      tags: ['Cart'],
      summary: 'Get cart for a user',
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
      ],
      responses: {
        '200': {
          description: 'Cart data returned successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } }
        },
        '400': { description: 'Invalid request' }
      }
    }
  },
  '/cart/add': {
    post: {
      tags: ['Cart'],
      summary: 'Add an item to the cart',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'product_id', 'quantity', 'price'],
              properties: {
                user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                quantity: { type: 'integer', example: 2 },
                price: { type: 'number', example: 99.99 }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Item added to cart' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/cart/remove': {
    delete: {
      tags: ['Cart'],
      summary: 'Remove an item from the cart',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'product_id'],
              properties: {
                user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                product_id: { type: 'string', example: '64adf1ab1234567890abcdef' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Item removed from cart' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/cart/update-quantity': {
    put: {
      tags: ['Cart'],
      summary: 'Update item quantity in cart',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'product_id', 'quantity'],
              properties: {
                user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                quantity: { type: 'integer', example: 3 }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Cart item quantity updated' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/cart/clear/{userId}': {
    delete: {
      tags: ['Cart'],
      summary: 'Clear user cart',
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
      ],
      responses: {
        '200': { description: 'Cart cleared successfully' },
        '400': { description: 'Invalid request' }
      }
    }
  }
}; 