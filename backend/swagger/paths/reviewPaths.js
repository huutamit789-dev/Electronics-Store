module.exports = {
  '/reviews': {
    get: {
      tags: ['Reviews'],
      summary: 'List all reviews',
      responses: {
        '200': {
          description: 'List of reviews',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } }
        }
      }
    },
    post: {
      tags: ['Reviews'],
      summary: 'Create a new review',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Review' }
          }
        }
      },
      responses: {
        '201': { description: 'Review created successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/reviews/{id}': {
    put: {
      tags: ['Reviews'],
      summary: 'Update review',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Review ID to update' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Review' }
          }
        }
      },
      responses: {
        '200': { description: 'Review updated successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    },
    delete: {
      tags: ['Reviews'],
      summary: 'Delete an existing review',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Review ID to delete' }
      ],
      responses: {
        '200': { description: 'Review deleted successfully' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Review not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};