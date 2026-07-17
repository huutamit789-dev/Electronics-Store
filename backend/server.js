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
const dashboardRoutes = require('./routes/dashboardRoutes');
const couponRoutes = require('./routes/couponRoutes');
const componentRoutes = require('./routes/ComponentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Middleware Imports
const { responseHandler } = require('./middleware/responseHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');
const { errorHandler } = require('./middleware/errorHandler');

require('dotenv').config();

const PORT = process.env.PORT || 8090;
const app = express();

// --- Middleware Configuration ---

app.use(cors({
  origin: [/\.vercel\.app$/, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:8091'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}, Method: ${req.method}, Origin: ${req.headers.origin}`);
  next();
});

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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/transactions', transactionRoutes);

// --- Error Handling ---

// Catch-all for undefined routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// --- Database Connection & Server Start ---

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });