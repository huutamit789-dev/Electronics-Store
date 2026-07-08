/**
 * Error Messages
 * Centralized error messages for consistency
 */

module.exports = {
  // Authentication Errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid authentication credentials',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    UNAUTHORIZED: 'Unauthorized access'
  },

  // User Errors
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists',
    USERNAME_EXISTS: 'Username is already in use',
    EMAIL_EXISTS: 'Email is already in use',
    CANNOT_DELETE_SELF: 'You cannot delete your own account',
    ACCESS_DENIED: 'You do not have permission to perform this action'
  },

  // Validation Errors
  VALIDATION: {
    REQUIRED_FIELD: (field) => `${field} is required`,
    INVALID_FORMAT: (field) => `Invalid ${field} format`,
    INVALID_VALUE: (field, value) => `Invalid ${field}: ${value}`
  },

  // Product Errors
  PRODUCT: {
    NOT_FOUND: 'Product not found',
    OUT_OF_STOCK: 'Product is out of stock',
    INVALID_QUANTITY: 'Invalid quantity'
  },

  // Order Errors
  ORDER: {
    NOT_FOUND: 'Order not found',
    CANNOT_CANCEL: 'Order cannot be cancelled',
    INVALID_STATUS: 'Invalid order status'
  },

  // Payment Errors
  PAYMENT: {
    FAILED: 'Payment failed',
    INVALID_AMOUNT: 'Invalid payment amount',
    TRANSACTION_FAILED: 'Transaction failed'
  },

  // Generic Errors
  GENERIC: {
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    BAD_REQUEST: 'Bad Request',
    NOT_FOUND: 'Resource not found'
  }
};
