/**
 * Authorization Error
 * Used when user lacks permission
 */

const AppError = require('./AppError');

class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403);
  }
}

module.exports = AuthorizationError;
