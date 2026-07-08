/**
 * Errors Directory
 * Custom error classes
 */

const AppError = require('./AppError');
const NotFoundError = require('./NotFoundError');
const ValidationError = require('./ValidationError');
const AuthorizationError = require('./AuthorizationError');

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  AuthorizationError
};
