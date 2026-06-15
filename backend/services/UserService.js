// User Service
// Handles business logic and validation for user operations
const UserRepository = require('../repositories/UserRepository')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

class UserService {
  // Get all users
  async getAllUsers() {
    return await UserRepository.findAll()
  }

  // Create a new user
  async createUser(userData) {
    const { username, email, password, phonenumber } = userData

    // Validation
    if (!username || !email || !password || !phonenumber) {
      const error = new Error('username, email, password and phonenumber are required')
      error.status = 400
      throw error
    }

    // Check if email already exists
    const existing = await UserRepository.findByEmail(email)
    if (existing) {
      const error = new Error('Email already in use')
      error.status = 409
      throw error
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    const newUser = await UserRepository.create({
      username,
      email,
      password: hashedPassword,
      phonenumber
    })

    // Return user without password
    return {
      insertedId: newUser._id,
      user: {
        username: newUser.username,
        email: newUser.email,
        phonenumber: newUser.phonenumber
      }
    }
  }

  // Verify user password (for login)
  async verifyPassword(email, password) {
    const user = await UserRepository.findByEmail(email)
    if (!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error('Invalid password')
      error.status = 401
      throw error
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      phonenumber: user.phonenumber
    }
  }

  // Get user by ID
  async getUserById(id) {
    const user = await UserRepository.findById(id)
    if (!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    return user
  }
}

module.exports = new UserService()
