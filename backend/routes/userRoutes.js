// Route definitions for user operations
// This file maps HTTP paths to controller functions.
const express = require('express')
const { getUsers, createUser, loginUser } = require('../controllers/userController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

// GET /users -> list all users (without password hashes)
router.get('/', authMiddleware, getUsers)

// POST /users -> create a new user with hashed password
router.post('/', createUser)

// POST /users/login -> verify credentials and return a JWT
router.post('/login', loginUser)

module.exports = router
