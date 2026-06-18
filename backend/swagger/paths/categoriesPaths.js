module.exports = {
  // ============ categories ENDPOINTS ============
  '/categories': {
    get: {
      tags: ['categories'],
      summary: 'List all categories',
      responses: {
        '200': {
          description: 'List of categories',
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/categories' } }
            }
          }
        }
      }
    },
    post: {
      tags: ['categories'],
      summary: 'Create a new categories',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/categories' }
          }
        }
      },
      responses: {
        '201': { description: 'categories created successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
'/categories/{id}': {
    put: {
      tags: ['categories'],
      summary: 'Update an existing categories',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'categories ID to update' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/categories' }
          }
        }
      },
      responses: {
        '200': { description: 'categories updated successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    },
    delete: {
      tags: ['categories'],
      summary: 'Delete an existing categories',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'categories ID to delete' }
      ],
      responses: {
        '200': { description: 'categories deleted successfully' },
        '404': { description: 'categories not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
};