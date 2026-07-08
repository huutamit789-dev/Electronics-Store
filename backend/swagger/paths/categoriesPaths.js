module.exports = {
  '/categories': {
    get: {
      tags: ['Categories'],
      summary: 'List all categories',
      responses: {
        '200': {
          description: 'List of categories',
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } }
            }
          }
        }
      }
    },
    post: {
      tags: ['Categories'],
      summary: 'Create a new category',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Category' }
          }
        }
      },
      responses: {
        '201': { description: 'Category created successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/categories/{id}': {
    put: {
      tags: ['Categories'],
      summary: 'Update an existing category',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Category ID to update' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Category' }
          }
        }
      },
      responses: {
        '200': { description: 'Category updated successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    },
    delete: {
      tags: ['Categories'],
      summary: 'Delete an existing category',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Category ID to delete' }
      ],
      responses: {
        '200': { description: 'Category deleted successfully' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Category not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};