module.exports = {
  '/users': {
    get: {
      tags: ['Users'],
      summary: 'List all users',
      responses: {
        '200': {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' }
          }
        }
      },
      responses: {
        '201': { description: 'User created successfully' },
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  },
  '/users/login': {
    post: {
      tags: ['Users'],
      summary: 'Login with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginResponse' }
            }
          }
        },
        '400': { description: 'Missing email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Invalid password', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      }
    }
  }
};