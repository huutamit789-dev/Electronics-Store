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
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/reviews/{id}/status': {
    put: {
      tags: ['Reviews'],
      summary: 'Update review status',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Review ID to update status' }
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
        '200': { description: 'Review status updated successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/reviews/{id}': {
    delete: {
      tags: ['Reviews'],
      summary: 'Delete an existing review',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Review ID to delete' }
      ],
      responses: {
        '200': { description: 'Review deleted successfully' },
        '404': { description: 'Review not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};