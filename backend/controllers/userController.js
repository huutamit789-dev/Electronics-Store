const UserService = require('../services/UserService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all users without password hashes.
 * @route GET /users
 * @access Public
 */
const getUsers = asyncHandler(async (req, res) => {
  // Giả sử req.user đã được gán bởi Middleware trước đó
  const currentUser = req.user; 
  
  // Truyền currentUser vào Service
  const users = await UserService.getAllUsers(currentUser);
  
  res.success(users, 'Users returned successfully');
});
/**
 * @desc Create a new user account.
 * @route POST /users
 * @access Public
 */
const createUser = asyncHandler(async (req, res) => {
  const result = await UserService.createUser(req.body)
  res.success(result, 'User created successfully', 201)
})

/**
 * @desc Login with email and password, then return a JWT.
 * @route POST /users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await UserService.verifyPassword(email, password)
  res.success(result, 'Login successful')
})

module.exports = { getUsers, createUser, loginUser }
