require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_for_dev_only', 
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '1d'
};