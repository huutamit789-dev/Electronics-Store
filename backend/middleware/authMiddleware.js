const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Authorization token is required')
      error.status = 401
      throw error
    }

    if (!process.env.JWT_SECRET) {
      const error = new Error('JWT_SECRET is not defined in .env')
      error.status = 500
      throw error
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id, { password: 0 }).lean()

    if (!user) {
      const error = new Error('Authenticated user not found')
      error.status = 401
      throw error
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err.status = 401
    }
    next(err)
  }
}

module.exports = { authMiddleware }
