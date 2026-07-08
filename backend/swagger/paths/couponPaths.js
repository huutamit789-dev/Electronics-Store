module.exports = {
  '/coupons/verify': {
    post: {
      tags: ['Coupons'],
      summary: 'Verify coupon code',
      security: [{ bearerAuth: [] }],
      description: 'Validates a discount code against the total checkout amount',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'totalAmount'],
              properties: {
                code: { type: 'string', example: 'SAVE10' },
                totalAmount: { type: 'number', example: 100.50 }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Coupon verified successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  valid: { type: 'boolean', example: true },
                  discountAmount: { type: 'number', example: 10.05 },
                  finalAmount: { type: 'number', example: 90.45 },
                  message: { type: 'string', example: 'Coupon applied successfully' }
                }
              }
            }
          }
        },
        '400': { description: 'Invalid coupon or expired' },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/coupons': {
    get: {
      tags: ['Coupons'],
      summary: 'Get all coupons (Admin only)',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of coupons',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Coupon' } } } }
        },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    },
    post: {
      tags: ['Coupons'],
      summary: 'Create coupon (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'discountType', 'discountValue'],
              properties: {
                code: { type: 'string', example: 'SAVE10' },
                discountType: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
                discountValue: { type: 'number', example: 10 },
                minPurchaseAmount: { type: 'number', example: 50 },
                maxDiscountAmount: { type: 'number', example: 20 },
                expiryDate: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59Z' },
                usageLimit: { type: 'integer', example: 100 }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Coupon created successfully' },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' }
      }
    }
  },
  '/coupons/{id}': {
    delete: {
      tags: ['Coupons'],
      summary: 'Delete coupon (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Coupon ID' }
      ],
      responses: {
        '200': { description: 'Coupon deleted successfully' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Access denied: Admins only' },
        '404': { description: 'Coupon not found' }
      }
    }
  }
};
