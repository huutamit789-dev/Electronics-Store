module.exports = {
  '/components': {
    get: {
      tags: ['Components'],
      summary: 'Get all components',
      responses: {
        '200': {
          description: 'List of components',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Component' } } } }
        }
      }
    },
    post: {
      tags: ['Components'],
      summary: 'Create component (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Component' }
          }
        }
      },
      responses: {
        '201': { description: 'Component created successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    }
  },
  '/components/active': {
    get: {
      tags: ['Components'],
      summary: 'Get active components',
      responses: {
        '200': {
          description: 'List of active components',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Component' } } } }
        }
      }
    }
  },
  '/components/type/{type}': {
    get: {
      tags: ['Components'],
      summary: 'Get components by type',
      parameters: [
        { name: 'type', in: 'path', required: true, schema: { type: 'string' }, description: 'Component type' }
      ],
      responses: {
        '200': {
          description: 'List of components by type',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Component' } } } }
        }
      }
    }
  },
  '/components/position/{position}': {
    get: {
      tags: ['Components'],
      summary: 'Get components by position',
      parameters: [
        { name: 'position', in: 'path', required: true, schema: { type: 'string' }, description: 'Component position' }
      ],
      responses: {
        '200': {
          description: 'List of components by position',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Component' } } } }
        }
      }
    }
  },
  '/components/{id}': {
    get: {
      tags: ['Components'],
      summary: 'Get component by ID',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Component ID' }
      ],
      responses: {
        '200': {
          description: 'Component retrieved successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Component' } } }
        },
        '404': { description: 'Component not found' }
      }
    },
    put: {
      tags: ['Components'],
      summary: 'Update component (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Component ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Component' }
          }
        }
      },
      responses: {
        '200': { description: 'Component updated successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Component not found' }
      }
    },
    delete: {
      tags: ['Components'],
      summary: 'Delete component (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Component ID' }
      ],
      responses: {
        '200': { description: 'Component deleted successfully' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Component not found' }
      }
    }
  }
};
