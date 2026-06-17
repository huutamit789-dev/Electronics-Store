const UserService = require('../services/UserService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all users without password hashes.
 * @route GET /users
 * @access Public
 */
const getUsers = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
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
/**
 * @desc Delete a user by ID.
 * @route DELETE /users/:id
 * @access Private (Admin only)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  console.log('Current user in deleteUser controller:', currentUser); // Debug log
  const userIdToDelete = req.params.id;

  const result = await UserService.deleteUser(currentUser, userIdToDelete);
  
  res.success(result, 'User deleted successfully');
});

/**
 * @desc Update a user by ID.
 * @route PUT /users/:id
 * @access Private (Admin only)
 */
const updateUser = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const userIdToUpdate = req.params.id;
  const userData = req.body;

  const result = await UserService.updateUser(currentUser, userIdToUpdate, userData);

  res.success(result, 'User updated successfully');
});


module.exports = { getUsers, createUser, loginUser, deleteUser, updateUser }
