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
};