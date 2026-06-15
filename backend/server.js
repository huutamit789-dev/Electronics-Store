// Express server entry point
// This file configures middleware, routes, and starts the app after the database connects.
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const { connectDB } = require('./config/db')
const swaggerDocument = require('./swagger')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderHistoryRoutes = require('./routes/orderHistoryRoutes')
const { responseHandler } = require('./middleware/responseHandler')
const { notFoundHandler } = require('./middleware/notFoundHandler')
const { errorHandler } = require('./middleware/errorHandler')
require('dotenv').config()

const PORT = process.env.PORT || 8000
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(responseHandler)

// Health check route
app.get('/', (req, res) => {
  res.success({ status: 'ok' }, 'Backend API is running')
})

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Route registration for all endpoints
app.use('/users', userRoutes)
app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/cart', cartRoutes)
app.use('/payments', paymentRoutes)
app.use('/reviews', reviewRoutes)
app.use('/order-history', orderHistoryRoutes)

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
