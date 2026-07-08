/**
 * User Data Transfer Objects
 * Functions to format user data for API responses
 */

/**
 * Format user for response (exclude sensitive data)
 */
const formatUserResponse = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    phonenumber: user.phonenumber,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

/**
 * Format user list for response
 */
const formatUserListResponse = (users) => {
  return users.map(formatUserResponse);
};

/**
 * Format login response
 */
const formatLoginResponse = (token, user) => {
  return {
    token,
    user: formatUserResponse(user)
  };
};

module.exports = {
  formatUserResponse,
  formatUserListResponse,
  formatLoginResponse
};
