// Controller layer for user-related business logic
// This file handles user requests, validation, hashing, and database CRUD operations.
const User = require('../models/User')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

async function getUsers(req, res) {
  try {
    // Exclude password field from response for security
    const users = await User.find({}, { password: 0 }).lean()
    res.json(users)
  } catch (err) {
    console.error('❌ Fetch users error:', err)
    res.status(500).json({ error: 'Could not fetch users' })
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, phonenumber } = req.body
    if (!username || !email || !password || !phonenumber) {
      return res.status(400).json({ error: 'username, email, password and phonenumber are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const newUser = new User({ username, email, password: hashedPassword, phonenumber })
    await newUser.save()

    // Never return the hashed password in the response
    res.status(201).json({ insertedId: newUser._id, user: { username, email, phonenumber } })
  } catch (err) {
    console.error('❌ Create user error:', err)
    res.status(500).json({ error: 'Could not create user' })
  }
}

module.exports = { getUsers, createUser }
