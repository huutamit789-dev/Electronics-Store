module.exports = {
  '/dashboard/stats': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get dashboard statistics (Admin only)',
      security: [{ bearerAuth: [] }],
      description: 'Retrieves statistical summary, monthly revenue charts, and top products for admin dashboard',
      responses: {
        '200': {
          description: 'Dashboard statistics retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  totalOrders: { type: 'integer', example: 150 },
                  totalRevenue: { type: 'number', example: 50000.50 },
                  totalUsers: { type: 'integer', example: 45 },
                  monthlyRevenue: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        month: { type: 'string', example: '2024-01' },
                        revenue: { type: 'number', example: 10000 }
                      }
                    }
                  },
                  topProducts: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          }
        },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    }
  }
};
