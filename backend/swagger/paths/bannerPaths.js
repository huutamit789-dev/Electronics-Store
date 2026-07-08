module.exports = {
  '/banners': {
    get: {
      tags: ['Banners'],
      summary: 'Get all banners',
      responses: {
        '200': {
          description: 'List of banners',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Banner' } } } }
        }
      }
    },
    post: {
      tags: ['Banners'],
      summary: 'Create banner (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Banner' }
          }
        }
      },
      responses: {
        '201': { description: 'Banner created successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    }
  },
  '/banners/position/{position}': {
    get: {
      tags: ['Banners'],
      summary: 'Get active banners by position',
      parameters: [
        { name: 'position', in: 'path', required: true, schema: { type: 'string' }, description: 'Banner position' }
      ],
      responses: {
        '200': {
          description: 'List of active banners by position',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Banner' } } } }
        }
      }
    }
  },
  '/banners/{id}': {
    get: {
      tags: ['Banners'],
      summary: 'Get banner by ID',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Banner ID' }
      ],
      responses: {
        '200': {
          description: 'Banner retrieved successfully',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Banner' } } }
        },
        '404': { description: 'Banner not found' }
      }
    },
    put: {
      tags: ['Banners'],
      summary: 'Update banner (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Banner ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Banner' }
          }
        }
      },
      responses: {
        '200': { description: 'Banner updated successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Banner not found' }
      }
    },
    delete: {
      tags: ['Banners'],
      summary: 'Delete banner (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Banner ID' }
      ],
      responses: {
        '200': { description: 'Banner deleted successfully' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Banner not found' }
      }
    }
  }
};
