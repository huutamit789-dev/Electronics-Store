module.exports = {
  '/payments': {
    get: {
      tags: ['Payments'],
      summary: 'List all payments',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of payments',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } } } }
        },
        '401': { description: 'Unauthorized' }
      }
    },
    post: {
      tags: ['Payments'],
      summary: 'Create a new payment',
      security: [{ bearerAuth: [] }],
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
        '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/payments/momo/sandbox': {
    post: {
      tags: ['Payments'],
      summary: 'Initialize MoMo sandbox payment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount', 'orderId'],
              properties: {
                amount: { type: 'number', example: 100000 },
                orderId: { type: 'string', example: 'ORDER123' },
                orderInfo: { type: 'string', example: 'ElectroStore test payment' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'MoMo payment initialized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'MoMo sandbox payment initialized' },
                  data: {
                    type: 'object',
                    properties: {
                      payUrl: { type: 'string', example: 'https://developers.momo.vn/v3/checkout?amount=100000&orderId=ORDER123' },
                      amount: { type: 'number', example: 100000 },
                      orderId: { type: 'string', example: 'ORDER123' },
                      partnerCode: { type: 'string', example: 'MOMO_SANDBOX' }
                    }
                  }
                }
              }
            }
          }
        },
        '400': { description: 'Missing required fields' },
        '401': { description: 'Unauthorized' }
      }
    }
  },
  '/payments/momo/callback': {
    post: {
      tags: ['Payments'],
      summary: 'MoMo payment callback endpoint',
      description: 'Receives payment result from MoMo after customer completes payment',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                orderId: { type: 'string', example: 'ORDER123' },
                resultCode: { type: 'integer', example: 0 },
                message: { type: 'string', example: 'Success' },
                transId: { type: 'string', example: '123456789' },
                amount: { type: 'number', example: 100000 }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Payment callback processed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Thanh toán thành công' },
                  data: {
                    type: 'object',
                    properties: {
                      orderId: { type: 'string', example: 'ORDER123' },
                      paymentStatus: { type: 'string', example: 'paid' },
                      orderStatus: { type: 'string', example: 'completed' },
                      transId: { type: 'string', example: '123456789' }
                    }
                  }
                }
              }
            }
          }
        },
        '400': { description: 'Invalid request' },
        '404': { description: 'Order not found' }
      }
    }
  },
  '/payments/momo/test-result': {
    post: {
      tags: ['Payments'],
      summary: 'Test MoMo payment result (simulated)',
      security: [{ bearerAuth: [] }],
      description: 'Simulates MoMo payment result for testing purposes',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['orderId'],
              properties: {
                orderId: { type: 'string', example: 'ORDER123' },
                success: { type: 'boolean', example: true },
                amount: { type: 'number', example: 100000 }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Test payment result processed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Thanh toán thành công' },
                  data: {
                    type: 'object',
                    properties: {
                      orderId: { type: 'string', example: 'ORDER123' },
                      paymentStatus: { type: 'string', example: 'paid' },
                      orderStatus: { type: 'string', example: 'completed' },
                      transId: { type: 'string', example: 'TEST_1234567890' }
                    }
                  }
                }
              }
            }
          }
        },
        '400': { description: 'Invalid request' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Order not found' }
      }
    }
  }
};