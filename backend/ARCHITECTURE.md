# Backend Architecture Documentation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Directory Explanations](#directory-explanations)
3. [API Request Flow](#api-request-flow)
4. [Design Patterns](#design-patterns)
5. [Missing Directories (Recommended)](#missing-directories-recommended)
6. [Code Organization Best Practices](#code-organization-best-practices)

---

## Project Structure

```
backend/
├── config/              # Configuration files (database, redis, app settings)
├── controllers/         # Request handlers - validate input, call services, send responses
├── middleware/          # Express middleware (auth, logging, error handling)
├── models/              # Mongoose schemas (database models)
├── repositories/        # Data access layer - direct database operations
├── routes/              # API route definitions (URL mappings)
├── services/            # Business logic layer - core application logic
├── scripts/             # Utility scripts (seeding, migrations, maintenance)
├── swagger/             # API documentation (OpenAPI/Swagger)
├── logs/                # Application logs
├── server.js            # Application entry point
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

---

## Directory Explanations

### `/config`
**Purpose**: Application configuration and external service connections

**Files**:
- `config.js` - App-wide configuration settings
- `db.js` - MongoDB/Mongoose connection setup
- `redis.js` - Redis connection configuration

**When to use**: When you need to configure database connections, external APIs, or app settings.

---

### `/controllers`
**Purpose**: HTTP request handlers - the first layer that processes incoming requests

**Responsibilities**:
- Extract and validate request data from `req.body`, `req.params`, `req.query`
- Call appropriate service methods with business logic
- Format and send HTTP responses using `res.success()` or `res.error()`
- Handle request-specific logic (authentication checks from middleware)

**Example**:
```javascript
const getUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsers(req.query.page, req.query.limit);
  res.success(users, 'Users returned successfully');
});
```

**When to use**: For handling HTTP requests and responses. Controllers should be thin and delegate business logic to services.

---

### `/middleware`
**Purpose**: Express middleware functions that intercept requests

**Files**:
- `authMiddleware.js` - JWT authentication and authorization
- `asyncHandler.js` - Wraps async route handlers to catch errors
- `errorHandler.js` - Centralized error handling and logging
- `responseHandler.js` - Adds `res.success()` helper to response object
- `notFoundHandler.js` - Handles 404 errors for undefined routes
- `logger.js` - Request logging
- `httpStatusMessages.js` - HTTP status code utilities

**When to use**: When you need to process requests before they reach controllers (auth, logging, validation) or handle errors globally.

---

### `/models`
**Purpose**: Mongoose schema definitions - database structure and validation

**Responsibilities**:
- Define document structure (fields, types, defaults)
- Define validation rules (required, unique, enum)
- Define virtuals and instance methods
- Define indexes for performance

**Example**:
```javascript
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true }
});
```

**When to use**: When defining database collections and their structure. Models should only contain schema definitions, not business logic.

---

### `/repositories`
**Purpose**: Data Access Layer - abstracts database operations

**Responsibilities**:
- Direct database queries using Mongoose models
- Complex query logic (aggregations, lookups)
- Database transaction management
- Cache integration (if using Redis)

**Example**:
```javascript
async findByUsername(username) {
  return await UserModel.findOne({ username });
}

async create(userData) {
  return await UserModel.create(userData);
}
```

**When to use**: For all database operations. Services should call repositories instead of using models directly. This makes testing easier and separates concerns.

---

### `/routes`
**Purpose**: API endpoint definitions - maps URLs to controller functions

**Responsibilities**:
- Define HTTP methods (GET, POST, PUT, DELETE)
- Apply middleware to routes (auth, validation)
- Route parameter extraction
- Route grouping and organization

**Example**:
```javascript
router.get('/', authMiddleware, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
```

**When to use**: When defining API endpoints. Routes should be simple and only map URLs to controllers.

---

### `/services`
**Purpose**: Business Logic Layer - core application logic

**Responsibilities**:
- Implement business rules and workflows
- Coordinate multiple repository calls
- Handle transactions
- Call external services (email, payment APIs)
- Transform data between layers

**Example**:
```javascript
async createUser(userData) {
  // Validate business rules
  const existingUser = await UserRepository.findByUsername(userData.username);
  if (existingUser) throw new Error('Username already exists');
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create user
  const user = await UserRepository.create({ ...userData, password: hashedPassword });
  
  // Create default role
  await UserRoleRepository.create({ user_id: user._id, role: 'user' });
  
  return user;
}
```

**When to use**: For all business logic. Services should not know about HTTP (no req/res objects). They receive data and return data.

---

### `/scripts`
**Purpose**: Utility scripts for maintenance and data management

**Files**:
- `seed_coupons.js` - Seed coupon data
- `fixProductCategories.js` - Data migration/fix script
- `test_stats.js` - Testing utilities

**When to use**: For one-time tasks, data seeding, migrations, or maintenance operations.

---

### `/swagger`
**Purpose**: API documentation using OpenAPI/Swagger specification

**Structure**:
- `index.js` - Main Swagger document configuration
- `components.js` - Reusable components (schemas, security schemes)
- `paths/` - Endpoint definitions grouped by feature
- `schemas/` - Data model definitions for documentation

**When to use**: When documenting API endpoints for frontend developers or external consumers.

---

### `/logs`
**Purpose**: Application log files

**Files**:
- `error.log` - Error logs from errorHandler middleware

**When to use**: Automatically generated by the application. Do not manually edit.

---

## API Request Flow

```
1. HTTP Request
   ↓
2. Express Middleware Chain
   - CORS
   - JSON Parser
   - Logger
   - Response Handler (adds res.success)
   ↓
3. Route Matching (routes/)
   - URL pattern matching
   - Middleware application (authMiddleware)
   ↓
4. Controller (controllers/)
   - Extract request data
   - Call service
   - Send response
   ↓
5. Service (services/)
   - Business logic
   - Call repositories
   - Coordinate operations
   ↓
6. Repository (repositories/)
   - Database queries
   - Return data
   ↓
7. Response flows back up the chain
   ↓
8. Error Handler (if error occurs)
   - Log error
   - Send error response
```

### Example: User Login Flow

```
POST /api/users/login
{
  "username": "john",
  "password": "password123"
}
↓
[Route] userRoutes.js
  router.post('/login', loginUser)
↓
[Controller] userController.js
  loginUser(req, res)
  - Extract username, password from req.body
  - Call UserService.verifyPassword(username, password)
↓
[Service] UserService.js
  verifyPassword(username, password)
  - Normalize username
  - Call UserRepository.findByUsername(username)
  - Compare password with bcrypt
  - Call UserRoleRepository.findByUserId(user._id)
  - Generate JWT token
  - Return { token, user }
↓
[Repository] UserRepository.js
  findByUsername(username)
  - UserModel.findOne({ username })
↓
[Response] userController.js
  res.success(result, 'Login successful')
↓
[Client] Receives:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbG...",
    "user": { "id": "...", "username": "john", "role": "user" }
  }
}
```

---

## Design Patterns

### 1. Repository Pattern
**Purpose**: Abstract data access logic

**Benefits**:
- Separates business logic from database operations
- Makes testing easier (can mock repositories)
- Centralizes query logic
- Easy to switch database implementations

**Implementation**: All database operations go through repositories, services never use models directly.

---

### 2. Service Layer Pattern
**Purpose**: Encapsulate business logic

**Benefits**:
- Reusable business logic across multiple controllers
- Controllers remain thin (HTTP concerns only)
- Easy to test business logic independently
- Clear separation of concerns

**Implementation**: Controllers call services, services call repositories.

---

### 3. Middleware Pattern
**Purpose**: Cross-cutting concerns (auth, logging, error handling)

**Benefits**:
- Reusable across routes
- Clean separation of concerns
- Easy to add/remove functionality
- Consistent behavior across application

**Implementation**: Express middleware chain for authentication, logging, error handling.

---

### 4. Dependency Injection
**Purpose**: Loose coupling between components

**Benefits**:
- Easy to test (can inject mocks)
- Flexible configuration
- Clear dependencies

**Implementation**: Services import repositories, controllers import services.

---

## Missing Directories (Recommended)

Based on industry best practices, the following directories should be added:

### `/utils`
**Purpose**: General utility functions used across the application

**What to put here**:
- Date/time formatting functions
- String manipulation utilities
- File upload/download helpers
- Pagination helpers
- Sorting utilities

**Example structure**:
```
utils/
├── dateUtils.js
├── stringUtils.js
├── fileUtils.js
├── pagination.js
└── index.js
```

---

### `/validators`
**Purpose**: Input validation schemas and functions

**What to put here**:
- Request body validation schemas
- Parameter validation
- Business rule validation
- Sanitization functions

**Example structure**:
```
validators/
├── userValidators.js
├── productValidators.js
├── orderValidators.js
└── index.js
```

**Why needed**: Currently validation is mixed in controllers and services. Extracting to validators makes it reusable and testable.

---

### `/constants`
**Purpose**: Application constants and enums

**What to put here**:
- Status codes (ACTIVE, INACTIVE, PENDING)
- Error messages
- Role definitions
- Configuration constants
- Pagination defaults

**Example structure**:
```
constants/
├── statusCodes.js
├── errorMessages.js
├── roles.js
├── pagination.js
└── index.js
```

**Why needed**: Avoids magic strings/numbers scattered throughout code. Makes maintenance easier.

---

### `/tests`
**Purpose**: Automated tests

**What to put here**:
- Unit tests (services, repositories)
- Integration tests (API endpoints)
- Test fixtures and mocks
- Test configuration

**Example structure**:
```
tests/
├── unit/
│   ├── services/
│   └── repositories/
├── integration/
│   └── routes/
├── fixtures/
└── setup.js
```

**Why needed**: Critical for maintaining code quality and preventing regressions.

---

### `/dtos` (Data Transfer Objects)
**Purpose**: Request/response data structures

**What to put here**:
- Request body schemas
- Response formatters
- Data transformation functions
- API contract definitions

**Example structure**:
```
dtos/
├── userDTO.js
├── productDTO.js
├── orderDTO.js
└── index.js
```

**Why needed**: Separates API contracts from business logic. Makes API changes easier.

---

### `/errors`
**Purpose**: Custom error classes

**What to put here**:
- Custom error types (ValidationError, NotFoundError, AuthorizationError)
- Error factory functions
- Error handling utilities

**Example structure**:
```
errors/
├── AppError.js
├── ValidationError.js
├── NotFoundError.js
├── AuthorizationError.js
└── index.js
```

**Why needed**: Better error handling than generic Error class. Enables specific error handling in middleware.

---

### `/helpers`
**Purpose**: Helper functions for specific features

**What to put here**:
- Email helpers
- Payment helpers
- SMS helpers
- Third-party API wrappers

**Example structure**:
```
helpers/
├── emailHelper.js
├── paymentHelper.js
├── smsHelper.js
└── index.js
```

**Why needed**: Keeps third-party integrations organized and reusable.

---

## Code Organization Best Practices

### 1. File Naming Conventions
- **Controllers**: `[Feature]Controller.js` (PascalCase)
- **Services**: `[Feature]Service.js` (PascalCase)
- **Repositories**: `[Feature]Repository.js` (PascalCase)
- **Routes**: `[feature]Routes.js` (camelCase)
- **Models**: `[Feature]Model.js` (PascalCase)
- **Middleware**: `[feature]Middleware.js` (camelCase)

### 2. Import Order
```javascript
// 1. Node.js built-ins
const fs = require('fs');
const path = require('path');

// 2. External dependencies
const express = require('express');
const bcrypt = require('bcrypt');

// 3. Internal imports (grouped by type)
const config = require('../config/config');
const UserRepository = require('../repositories/UserRepository');
const { asyncHandler } = require('../middleware/asyncHandler');
```

### 3. Controller Best Practices
- Keep controllers thin (max 20-30 lines per function)
- No business logic in controllers
- Use asyncHandler to wrap async route handlers
- Extract validation to validators
- Use consistent response format (res.success)

### 4. Service Best Practices
- No HTTP concerns (no req/res objects)
- Pure business logic
- Use transactions for multi-step operations
- Return data, not HTTP responses
- Handle errors with appropriate status codes

### 5. Repository Best Practices
- Only database operations
- No business logic
- Use meaningful method names (findByUsername, not find)
- Handle database-specific errors
- Use indexes for performance

### 6. Error Handling
- Use custom error classes
- Include appropriate status codes
- Log errors with context
- Never expose sensitive data in error messages
- Use asyncHandler to catch async errors

---

## Recommended Next Steps

1. **Create missing directories**:
   - `/utils` - for utility functions
   - `/validators` - for input validation
   - `/constants` - for application constants
   - `/tests` - for automated tests
   - `/dtos` - for data transfer objects
   - `/errors` - for custom error classes
   - `/helpers` - for feature-specific helpers

2. **Extract reusable code**:
   - Move validation logic from controllers/services to `/validators`
   - Move magic strings/numbers to `/constants`
   - Move utility functions to `/utils`
   - Create custom error classes in `/errors`

3. **Add tests**:
   - Start with service layer unit tests
   - Add repository tests
   - Add integration tests for critical endpoints

4. **Improve documentation**:
   - Add JSDoc comments to all functions
   - Keep API documentation in sync with code
   - Document complex business logic

---

## Summary

This backend follows a **layered architecture** with clear separation of concerns:

- **Routes** → URL mapping
- **Controllers** → HTTP request/response handling
- **Services** → Business logic
- **Repositories** → Data access
- **Models** → Database schema

The current structure is good but can be improved by adding the recommended directories for better code organization, reusability, and maintainability.
