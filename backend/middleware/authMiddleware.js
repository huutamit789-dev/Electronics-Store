const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const config = require('../config/config')

// Middleware xác thực token
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Authorization token is required')
      error.status = 401
      throw error
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)
    
    // Tìm user và gắn thêm thông tin role để middleware sau sử dụng
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

// Middleware kiểm tra quyền admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' })
  }
}

module.exports = { authMiddleware, adminMiddleware }