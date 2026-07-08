# Getting Started Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Running the Application](#running-the-application)
5. [Project Structure Overview](#project-structure-overview)
6. [Adding a New Feature](#adding-a-new-feature)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Redis** (optional, for caching) - [Download here](https://redis.io/download)
- **Git** - [Download here](https://git-scm.com/downloads)

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd BackEnd/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server
PORT=8090
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/electronics_store

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@electronics-store.com
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### 5. Start Redis (optional)

```bash
# On Windows
redis-server

# On macOS/Linux
redis-server
```

---

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Production Mode

```bash
npm start
```

### Debug Mode

```bash
npm run debug
```

This runs the server with Node.js debugger enabled.

---

## Project Structure Overview

```
backend/
├── config/              # Configuration files (DB, Redis, app settings)
├── controllers/         # HTTP request handlers
├── middleware/          # Express middleware (auth, logging, errors)
├── models/              # Mongoose schemas (database models)
├── repositories/        # Data access layer (database operations)
├── routes/              # API route definitions
├── services/            # Business logic layer
├── utils/               # General utility functions
├── validators/          # Input validation functions
├── constants/           # Application constants and enums
├── dtos/                # Data Transfer Objects (request/response formatting)
├── errors/              # Custom error classes
├── helpers/             # Feature-specific helpers (email, payment, etc.)
├── scripts/             # Utility scripts (seeding, migrations)
├── swagger/             # API documentation
├── logs/                # Application logs
├── tests/               # Automated tests
├── server.js            # Application entry point
└── package.json         # Dependencies and scripts
```

### Key Concepts

**Request Flow:**
```
Request → Middleware → Routes → Controllers → Services → Repositories → Database
```

**Layer Responsibilities:**

- **Routes**: Map URLs to controller functions
- **Controllers**: Handle HTTP requests/responses, call services
- **Services**: Implement business logic, coordinate repositories
- **Repositories**: Handle database operations
- **Models**: Define database schemas

---

## Adding a New Feature

Let's say you want to add a "Product Review" feature. Here's how:

### Step 1: Create the Model

Create `models/ReviewModel.js`:

```javascript
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
```

### Step 2: Create the Repository

Create `repositories/ReviewRepository.js`:

```javascript
const ReviewModel = require('../models/ReviewModel');

class ReviewRepository {
  async create(reviewData) {
    return await ReviewModel.create(reviewData);
  }

  async findByProductId(productId) {
    return await ReviewModel.find({ product_id: productId }).populate('user_id');
  }

  async findByUserId(userId) {
    return await ReviewModel.find({ user_id: userId }).populate('product_id');
  }

  async findById(reviewId) {
    return await ReviewModel.findById(reviewId);
  }

  async update(reviewId, updateData) {
    return await ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true });
  }

  async delete(reviewId) {
    return await ReviewModel.findByIdAndDelete(reviewId);
  }
}

module.exports = new ReviewRepository();
```

### Step 3: Create the Service

Create `services/ReviewService.js`:

```javascript
const ReviewRepository = require('../repositories/ReviewRepository');
const { ValidationError, NotFoundError } = require('../errors');
const { validateReview } = require('../validators/reviewValidators');

class ReviewService {
  async createReview(reviewData) {
    // Validate input
    validateReview(reviewData);

    // Check if user already reviewed this product
    const existingReview = await ReviewRepository.findOne({
      user_id: reviewData.user_id,
      product_id: reviewData.product_id
    });

    if (existingReview) {
      throw new ValidationError('You have already reviewed this product');
    }

    return await ReviewRepository.create(reviewData);
  }

  async getProductReviews(productId) {
    return await ReviewRepository.findByProductId(productId);
  }

  async getUserReviews(userId) {
    return await ReviewRepository.findByUserId(userId);
  }

  async updateReview(reviewId, updateData, userId) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.user_id.toString() !== userId) {
      throw new ValidationError('You can only update your own reviews');
    }

    return await ReviewRepository.update(reviewId, updateData);
  }

  async deleteReview(reviewId, userId) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.user_id.toString() !== userId) {
      throw new ValidationError('You can only delete your own reviews');
    }

    await ReviewRepository.delete(reviewId);
  }
}

module.exports = new ReviewService();
```

### Step 4: Create the Validator

Create `validators/reviewValidators.js`:

```javascript
const { ValidationError } = require('../errors');

const validateReview = (reviewData) => {
  const { rating, comment } = reviewData;

  if (!rating || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5');
  }

  if (!comment || comment.trim().length < 10) {
    throw new ValidationError('Comment must be at least 10 characters long');
  }

  return true;
};

module.exports = { validateReview };
```

### Step 5: Create the Controller

Create `controllers/ReviewController.js`:

```javascript
const ReviewService = require('../services/ReviewService');
const { asyncHandler } = require('../middleware/asyncHandler');

const createReview = asyncHandler(async (req, res) => {
  const reviewData = {
    ...req.body,
    user_id: req.user.id
  };
  const review = await ReviewService.createReview(reviewData);
  res.success(review, 'Review created successfully', 201);
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewService.getProductReviews(req.params.productId);
  res.success(reviews, 'Reviews retrieved successfully');
});

const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewService.getUserReviews(req.user.id);
  res.success(reviews, 'Your reviews retrieved successfully');
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await ReviewService.updateReview(req.params.id, req.body, req.user.id);
  res.success(review, 'Review updated successfully');
});

const deleteReview = asyncHandler(async (req, res) => {
  await ReviewService.deleteReview(req.params.id, req.user.id);
  res.success(null, 'Review deleted successfully');
});

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview
};
```

### Step 6: Create the Routes

Create `routes/reviewRoutes.js`:

```javascript
const express = require('express');
const { createReview, getProductReviews, getUserReviews, updateReview, deleteReview } = require('../controllers/ReviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', authMiddleware, createReview);
router.get('/my-reviews', authMiddleware, getUserReviews);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
```

### Step 7: Register Routes in server.js

Add to `server.js`:

```javascript
const reviewRoutes = require('./routes/reviewRoutes');

// Add this line with other route registrations
app.use('/api/reviews', reviewRoutes);
```

### Step 8: Test the API

```bash
# Create a review
POST /api/reviews
Headers: Authorization: Bearer <token>
Body: {
  "product_id": "product_id_here",
  "rating": 5,
  "comment": "Great product!"
}

# Get product reviews
GET /api/reviews/product/:productId

# Get user's reviews
GET /api/reviews/my-reviews
Headers: Authorization: Bearer <token>
```

---

## Common Tasks

### Adding Validation

1. Create validator function in `validators/`
2. Import and use in controller or service
3. Use custom error classes from `errors/`

### Adding Constants

1. Add constant to appropriate file in `constants/`
2. Import where needed
3. Avoid magic strings/numbers in code

### Adding Utility Functions

1. Create utility function in `utils/`
2. Export from `utils/index.js`
3. Import where needed

### Adding Error Handling

1. Use custom error classes from `errors/`
2. Throw errors with appropriate status codes
3. Errors are automatically caught by `asyncHandler` and `errorHandler`

### Formatting API Responses

1. Create DTO functions in `dtos/`
2. Use DTOs in controllers before sending response
3. Keep response format consistent

---

## Troubleshooting

### Database Connection Error

**Problem**: `MongooseServerSelectionError`

**Solution**:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is listening on the correct port

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use`

**Solution**:
- Change `PORT` in `.env`
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :8090
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:8090 | xargs kill -9
  ```

### Module Not Found

**Problem**: `Error: Cannot find module '...'`

**Solution**:
- Run `npm install`
- Check if module is in `package.json`
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### JWT Token Issues

**Problem**: `JsonWebTokenError`

**Solution**:
- Ensure `JWT_SECRET` is set in `.env`
- Check token format in Authorization header
- Verify token hasn't expired

### CORS Issues

**Problem**: Browser blocks API requests

**Solution**:
- CORS is configured in `server.js`
- Ensure frontend origin is allowed
- Check if credentials are being sent correctly

---

## API Documentation

Once the server is running, access Swagger documentation at:

```
http://localhost:8090/api-docs
```

This provides interactive API documentation for all endpoints.

---

## Development Tips

1. **Keep controllers thin** - Move business logic to services
2. **Use repositories** - Don't use models directly in services
3. **Validate early** - Validate input in controllers or services
4. **Use custom errors** - Use error classes from `errors/` for better error handling
5. **Format responses** - Use DTOs to format API responses
6. **Add logs** - Use the logger middleware for debugging
7. **Write tests** - Add tests in `tests/` directory
8. **Document code** - Add JSDoc comments to functions
9. **Follow naming conventions** - Be consistent with file naming
10. **Use environment variables** - Never hardcode sensitive data

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
- [Swagger Documentation](https://swagger.io/docs/)

---

## Support

For questions or issues, please contact the development team or create an issue in the repository.
