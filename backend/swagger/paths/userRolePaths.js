module.exports = {
  '/user-role/{userId}': {
    get: {
      tags: ['UserRole'],
      summary: 'Get user role status by user ID',
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
      ],
      responses: {
        '200': {
          description: 'User role status retrieved successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRole' } } }
        },
        '401': { description: 'Unauthorized' },
        '404': { description: 'User not found' }
      }
    }
  },
  '/user-role/update-status': {
    put: {
      tags: ['UserRole'],
      summary: 'Update user status (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['userId', 'status'],
              properties: {
                userId: { type: 'string', example: '64adf1ab1234567890abcdef' },
                status: { type: 'string', example: 'active', enum: ['active', 'inactive', 'banned'] }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'User status updated successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    }
  }
};
