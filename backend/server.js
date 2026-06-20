// Express server entry point
// This file configures middleware, routes, and starts the app after the database connects.
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { connectDB } = require('./config/db');
const swaggerDocument = require('./swagger/index');
const logger = require('./middleware/logger');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderHistoryRoutes = require('./routes/orderHistoryRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const bannerRoutes = require('./routes/BannerRoutes');
const footerRoutes = require('./routes/FooterRoutes');

// Middleware Imports
const { responseHandler } = require('./middleware/responseHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');
const { errorHandler } = require('./middleware/errorHandler');

require('dotenv').config();

const PORT = process.env.PORT || 8090;
const app = express();

// --- Middleware Configuration ---

// Enable CORS for specified origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://lehuutamit.kimburin.i234.me'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Log every incoming request
app.use(logger);

// Inject response helper methods (like res.success)
app.use(responseHandler);

// --- Routes ---

// Health check endpoint
app.get('/', (req, res) => {
  res.success({ status: 'ok' }, 'Backend API is running');
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Endpoint registrations
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/order-history', orderHistoryRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/footers', footerRoutes);

// --- Error Handling ---

// Catch-all for undefined routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// --- Database Connection & Server Start ---

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });