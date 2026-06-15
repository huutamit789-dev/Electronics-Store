// Swagger documentation configuration for the ElectricStore backend API.
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'ElectricStore Backend API',
    version: '1.0.0',
    description: 'API documentation for the ElectricStore e-commerce backend.'
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Local development server'
    }
  ],
  components: {
    // Schema definitions describe the data models used in the API.
    // These correspond to collections/tables in the MongoDB database.
    schemas: {
      // User schema: user account information and authentication details.
      User: {
        type: 'object',
        required: ['username', 'email', 'password', 'phonenumber'],
        properties: {
          username: { type: 'string', example: 'john_doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', example: 'strongPassword123' },
          phonenumber: { type: 'string', example: '0123456789' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      // Category schema: product categories (e.g., Laptops, Phones, etc.).
      Category: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Laptops' },
          description: { type: 'string', example: 'Computer and laptop products' }
        }
      },
      // Product schema: product information including name, price, stock, and category.
      Product: {
        type: 'object',
        required: ['name', 'price', 'category_id'],
        properties: {
          name: { type: 'string', example: 'Gaming Laptop' },
          description: { type: 'string', example: 'High-performance laptop for gaming' },
          price: { type: 'number', example: 1499.99 },
          stock_quantity: { type: 'integer', example: 20 },
          image_url: { type: 'string', example: 'https://example.com/image.png' },
          category_id: { type: 'string', example: '64adf1ab1234567890abcdef' }
        }
      },
      // OrderItem schema: individual product details within an order.
      OrderItem: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          quantity: { type: 'integer', example: 2 }
        }
      },
      // Order schema: customer order containing multiple items and order status.
      Order: {
        type: 'object',
        required: ['user_id', 'items', 'total_price'],
        properties: {
          user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' }
          },
          total_price: { type: 'number', example: 2999.98 },
          status: { type: 'string', example: 'pending', enum: ['pending', 'completed', 'cancelled'] },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      // CartItem schema: product item in the shopping cart.
      CartItem: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          quantity: { type: 'integer', example: 3 }
        }
      },
      // Cart schema: user's shopping cart containing items and last updated timestamp.
      Cart: {
        type: 'object',
        required: ['user_id', 'items'],
        properties: {
          user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      // Payment schema: payment information and transaction details for an order.
      Payment: {
        type: 'object',
        required: ['order_id', 'payment_method'],
        properties: {
          order_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          payment_method: { type: 'string', example: 'credit_card', enum: ['cod', 'credit_card', 'momo', 'zalopay'] },
          payment_status: { type: 'string', example: 'pending', enum: ['pending', 'paid', 'failed', 'refunded'] },
          transaction_id: { type: 'string', example: 'txn_123456' },
          amount: { type: 'number', example: 1499.99 },
          paid_at: { type: 'string', format: 'date-time' }
        }
      },
      // Review schema: user product reviews with rating and comments.
      Review: {
        type: 'object',
        required: ['user_id', 'product_id', 'rating'],
        properties: {
          user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          rating: { type: 'integer', example: 5, minimum: 1, maximum: 5 },
          comment: { type: 'string', example: 'Great product and fast delivery!' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      // OrderHistory schema: order status change history and related notes.
      OrderHistory: {
        type: 'object',
        required: ['order_id'],
        properties: {
          order_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          old_status: { type: 'string', example: 'pending' },
          new_status: { type: 'string', example: 'completed' },
          changed_at: { type: 'string', format: 'date-time' },
          note: { type: 'string', example: 'Order shipped successfully' }
        }
      },
      // ErrorResponse schema: standardized error response format with status code, error type, and message.
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Error message' }
        }
      }
    }
  },
  paths: {
    // ============ USER ENDPOINTS ============
    // Manage user accounts and authentication
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
    // ============ CATEGORY ENDPOINTS ============
    // Manage product categories
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all categories',
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a new category',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Category' }
            }
          }
        },
        responses: {
          '201': { description: 'Category created successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    // ============ PRODUCT ENDPOINTS ============
    // Manage product inventory and details
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List all products',
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          '201': { description: 'Product created successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/products/{id}': {
      put: {
        tags: ['Products'],
        summary: 'Update an existing product',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID to update' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          '200': { description: 'Product updated successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete an existing product',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID to delete' }
        ],
        responses: {
          '200': { description: 'Product deleted successfully' },
          '404': { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    // ============ ORDER ENDPOINTS ============
    // Manage customer orders and order status
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List all orders',
        responses: {
          '200': {
            description: 'List of orders',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' }
            }
          }
        },
        responses: {
          '201': { description: 'Order created successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/orders/{id}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Update order status',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ID to update status' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', example: 'completed', enum: ['pending', 'completed', 'cancelled'] }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Order status updated successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    // ============ CART ENDPOINTS ============
    // Manage user shopping carts
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart for a user',
        responses: {
          '200': {
            description: 'Cart data returned successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } }
          }
        }
      }
    },
    '/cart/add': {
      post: {
        tags: ['Cart'],
        summary: 'Add an item to the cart',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_id', 'product_id', 'quantity'],
                properties: {
                  user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                  product_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Item added to cart' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/cart/remove': {
      post: {
        tags: ['Cart'],
        summary: 'Remove an item from the cart',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_id', 'product_id'],
                properties: {
                  user_id: { type: 'string', example: '64adf1ab1234567890abcdef' },
                  product_id: { type: 'string', example: '64adf1ab1234567890abcdef' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Item removed from cart' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    // ============ PAYMENT ENDPOINTS ============
    // Process and track payment transactions
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
    // ============ REVIEW ENDPOINTS ============
    // Manage product reviews and ratings
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
    // ============ ORDER HISTORY ENDPOINTS ============
    // Track order status changes and history
    '/order-history': {
      get: {
        tags: ['OrderHistory'],
        summary: 'List all order history entries',
        responses: {
          '200': {
            description: 'List of order history entries',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/OrderHistory' } } } }
          }
        }
      },
      post: {
        tags: ['OrderHistory'],
        summary: 'Add an order history entry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderHistory' }
            }
          }
        },
        responses: {
          '201': { description: 'Order history entry created successfully' },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
