/**
 * Centralized URL helper utility
 * Ensures all frontend URLs use the correct domain in production
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Builds a frontend URL by joining parts
 * @param {...string} parts - URL parts to join
 * @returns {string} Complete frontend URL
 */
const frontendUrl = (...parts) => {
  const cleanBase = FRONTEND_URL.replace(/\/+$/, ''); // Remove trailing slashes
  const cleanParts = parts.map(part => part.replace(/^\/+/, '')); // Remove leading slashes
  return [cleanBase, ...cleanParts].join('/');
};

/**
 * Builds verification email URL
 * @param {string} token - Verification token
 * @param {string} email - User email
 * @returns {string} Complete verification URL
 */
const verificationUrl = (token, email) => {
  return frontendUrl(`verify-email?token=${token}&email=${encodeURIComponent(email)}`);
};

/**
 * Builds password reset URL
 * @param {string} token - Reset token
 * @param {string} email - User email
 * @returns {string} Complete reset URL
 */
const resetPasswordUrl = (token, email) => {
  return frontendUrl(`reset-password?token=${token}&email=${encodeURIComponent(email)}`);
};

module.exports = {
  frontendUrl,
  verificationUrl,
  resetPasswordUrl,
  FRONTEND_URL
};
