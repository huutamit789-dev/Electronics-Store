    module.exports = {
  '/payments': {
      get: {
        tags: ['Payments'],
        summary: 'List all payments',
        responses: {
          '200': {
            description: 'List of payments',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } } } }
          }
        }
      },
      post: {
        tags: ['Payments'],
        summary: 'Create a new payment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Payment' }
            }
          }
        },
        responses: {
          '201': { description: 'Payment created successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
};