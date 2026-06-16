module.exports = {
  // ============ PRODUCT ENDPOINTS ============
  '/products': {
    get: {
      tags: ['Products'],
      summary: 'List all products',
      responses: {
        '200': {
          description: 'List of products',
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
            }
          }
        }
      }
    },
    post: {
      tags: ['Products'],
      summary: 'Create a new product',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Product' }
          }
        }
      },
      responses: {
        '201': { description: 'Product created successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/products/{id}': {
    put: {
      tags: ['Products'],
      summary: 'Update an existing product',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID to update' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Product' }
          }
        }
      },
      responses: {
        '200': { description: 'Product updated successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete an existing product',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID to delete' }
      ],
      responses: {
        '200': { description: 'Product deleted successfully' },
        '404': { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};