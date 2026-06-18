// Route definitions for user operations
// This file maps HTTP paths to controller functions.
const express = require('express')
const { getUsers, createUser, loginUser, deleteUser, updateUser } = require('../controllers/userController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

// GET /users -> list all users (without password hashes)
router.get('/', authMiddleware, getUsers)

// POST /users -> create a new user with hashed password
router.post('/', createUser)

// POST /users/login -> verify credentials and return a JWT
router.post('/login', loginUser)

// PUT /users/:id -> update user info (e.g. role/status) - only for admins
router.put('/:id', authMiddleware, updateUser)

// DELETE /users/:id -> delete a user by ID
router.delete('/:id', authMiddleware, deleteUser)
module.exports = router