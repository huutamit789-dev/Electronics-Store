const UserService = require('../services/UserService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all users without password hashes.
 * @route GET /users
 * @access Public
 */
const getUsers = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const users = await UserService.getAllUsers(currentUser, req.query.page, req.query.limit);
  
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
  const { username, password } = req.body; // Bắt buộc nhận username và password

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập Username và Password" });
  }

  console.log('\n🔐 USER LOGIN ATTEMPT');
  console.log(`👤 Username: ${username}`);
  console.log(`🌐 IP: ${req.ip}`);
  console.log(`🕐 Time: ${new Date().toISOString()}`);

  const result = await UserService.verifyPassword(username, password);
  
  if (result.success) {
    console.log(`✅ LOGIN SUCCESSFUL: ${username}`);
  } else {
    console.log(`❌ LOGIN FAILED: ${username}`);
  }
  
  res.success(result, 'Login successful');
});
/**
 * @desc Delete a user by ID.
 * @route DELETE /users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  const userIdToDelete = req.params.id;

  const result = await UserService.deleteUser(currentUser, userIdToDelete);
  
  res.success(result, 'User deleted successfully');
});

/**
 * @desc Update a user by ID.
 * @route PUT /users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const userIdToUpdate = req.params.id;
  const userData = req.body;

  const result = await UserService.updateUser(currentUser, userIdToUpdate, userData);

  res.success(result, 'User updated successfully');
});


module.exports = { getUsers, createUser, loginUser, deleteUser, updateUser }
