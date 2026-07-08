module.exports = {
  '/footer/active': {
    get: {
      tags: ['Footer'],
      summary: 'Get active footer',
      responses: {
        '200': {
          description: 'Active footer retrieved successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Footer' } } }
        }
      }
    }
  },
  '/footer/{id}': {
    get: {
      tags: ['Footer'],
      summary: 'Get footer by ID',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Footer ID' }
      ],
      responses: {
        '200': {
          description: 'Footer retrieved successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Footer' } } }
        },
        '404': { description: 'Footer not found' }
      }
    },
    put: {
      tags: ['Footer'],
      summary: 'Update footer (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Footer ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Footer' }
          }
        }
      },
      responses: {
        '200': { description: 'Footer updated successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Footer not found' }
      }
    },
    delete: {
      tags: ['Footer'],
      summary: 'Delete footer (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Footer ID' }
      ],
      responses: {
        '200': { description: 'Footer deleted successfully' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Footer not found' }
      }
    }
  },
  '/footer': {
    get: {
      tags: ['Footer'],
      summary: 'Get all footers (Admin only)',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of footers',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Footer' } } } }
        },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    },
    post: {
      tags: ['Footer'],
      summary: 'Create footer (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Footer' }
          }
        }
      },
      responses: {
        '201': { description: 'Footer created successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    }
  }
};
