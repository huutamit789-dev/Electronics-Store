/**
 * User Validators
 * Validation functions for user-related operations
 */

const { VALIDATION } = require('../constants/errorMessages');
const ValidationError = require('../errors/ValidationError');

/**
 * Validate user registration data
 */
const validateUserRegistration = (userData) => {
  const { username, email, password, phonenumber } = userData;

  // Validate username
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new ValidationError(VALIDATION.INVALID_FORMAT('username'));
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new ValidationError(VALIDATION.INVALID_FORMAT('password'));
  }

  // Validate phonenumber
  if (!phonenumber || typeof phonenumber !== 'string' || phonenumber.trim().length < 10) {
    throw new ValidationError(VALIDATION.INVALID_FORMAT('phonenumber'));
  }

  // Validate email format (if provided)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError(VALIDATION.INVALID_FORMAT('email'));
    }
  }

  return true;
};

/**
 * Validate user login data
 */
const validateUserLogin = (loginData) => {
  const { username, password } = loginData;

  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }

  return true;
};

/**
 * Validate user update data
 */
const validateUserUpdate = (userData) => {
  const { username, email, phonenumber } = userData;

  if (username && typeof username !== 'string') {
    throw new ValidationError(VALIDATION.INVALID_FORMAT('username'));
  }

  if (email && typeof email !== 'string') {
    throw new ValidationError(VALIDATION.INVALID_FORMAT('email'));
  }

  if (phonenumber && typeof phonenumber !== 'string') {
    throw new ValidationError(VALIDATION.INVALID_FORMAT('phonenumber'));
  }

  return true;
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate
};
