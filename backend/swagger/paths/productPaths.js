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
  '/products/getProductByCategoryId/{categoryId}': {
    get: {
      tags: ['Products'],
      summary: 'Get products by category ID',
      parameters: [
        {
          name: 'categoryId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Category ID to filter products'
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 1 },
          description: 'Page number'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 10 },
          description: 'Number of products per page'
        }
      ],
      responses: {
        '200': {
          description: 'Products returned successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Products returned successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      products: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Product' }
                      },
                      total: { type: 'integer', example: 12 },
                      totalPages: { type: 'integer', example: 2 },
                      currentPage: { type: 'integer', example: 1 }
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Invalid category ID',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
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
