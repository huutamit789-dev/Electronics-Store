// Route definitions for user operations
// This file maps HTTP paths to controller functions.
const express = require('express')
const { getUsers, createUser } = require('../controllers/userController')

const router = express.Router()

// GET /users -> list all users (without password hashes)
router.get('/', getUsers)

// POST /users -> create a new user with hashed password
router.post('/', createUser)

module.exports = router
