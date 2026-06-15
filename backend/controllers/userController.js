// User Controller
// Handles HTTP requests and responses for user operations
// Delegates business logic to UserService
const UserService = require('../services/UserService')

async function getUsers(req, res, next) {
  try {
    const users = await UserService.getAllUsers()
    res.json(users)
  } catch (err) {
    next(err)
  }
}

async function createUser(req, res, next) {
  try {
    const result = await UserService.createUser(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { getUsers, createUser }
