require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
 JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_for_dev_only',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS) || 10
};