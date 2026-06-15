// User Repository
// Handles all database operations for user data
const User = require('../models/UserModel')

class UserRepository {
  // Find all users (exclude password)
  async findAll() {
    return await User.find({}, { password: 0 }).lean()
  }

  // Find user by email
  async findByEmail(email) {
    return await User.findOne({ email })
  }

  // Find user by ID
  async findById(id) {
    return await User.findById(id, { password: 0 }).lean()
  }

  // Create a new user
  async create(userData) {
    const user = new User(userData)
    return await user.save()
  }

  // Update user
  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true, projection: { password: 0 } })
  }

  // Delete user
  async delete(id) {
    return await User.findByIdAndDelete(id)
  }
}

module.exports = new UserRepository()
