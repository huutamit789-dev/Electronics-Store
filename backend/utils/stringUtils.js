/**
 * String Utilities
 * Helper functions for string manipulation
 */

/**
 * Normalize string (trim and lowercase)
 */
const normalizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase();
};

/**
 * Generate random string
 */
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Slugify string
 */
const slugify = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

module.exports = {
  normalizeString,
  generateRandomString,
  slugify
};
