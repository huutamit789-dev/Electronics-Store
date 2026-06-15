  module.exports = {
 '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart for a user',
        responses: {
          '200': {
            description: 'Cart data returned successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } }
          }
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
                required: ['user_id', 'product_id', 'quantity'],
                properties: {
                  user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                  product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                  quantity: { type: 'integer', example: 2 }
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
      post: {
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
  }