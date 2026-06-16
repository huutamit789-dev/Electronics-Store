// Express server entry point
// This file configures middleware, routes, and starts the app after the database connects.
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const { connectDB } = require('./config/db')
const swaggerDocument = require('./swagger/index')
const userRoutes = require('./routes/userRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderHistoryRoutes = require('./routes/orderHistoryRoutes')
const userRoleRoutes = require('./routes/userRoleRoutes')
const { responseHandler } = require('./middleware/responseHandler')
const { notFoundHandler } = require('./middleware/notFoundHandler')
const { errorHandler } = require('./middleware/errorHandler')
require('dotenv').config()

const PORT = process.env.PORT || 8090 
const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json())
app.use(responseHandler)
app.use(cors({ origin: 'http://localhost:5173' }));
// Health check route
app.get('/', (req, res) => {
  res.success({ status: 'ok' }, 'Backend API is running')
})

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Route registration for all endpoints
app.use('/api/users', userRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/order-history', orderHistoryRoutes)
app.use('/api/user-roles', userRoleRoutes)
// Handle unknown routes before the centralized error handler
app.use(notFoundHandler)

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB before starting the HTTP server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  })
