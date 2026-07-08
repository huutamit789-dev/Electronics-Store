# ElectricStore Backend API Endpoints

Base URL: `http://localhost:8090`

## Authentication
Most endpoints require Bearer Token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Users

### GET /users
- **Description**: List all users
- **Auth**: Required
- **Response**: Array of users

### POST /users
- **Description**: Create a new user
- **Auth**: Public
- **Body**: User object
- **Response**: Created user

### POST /users/login
- **Description**: Login with email and password
- **Auth**: Public
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: JWT token and user info

### PUT /users/:id
- **Description**: Update user by ID
- **Auth**: Required
- **Body**: User object
- **Response**: Updated user

### DELETE /users/:id
- **Description**: Delete user by ID
- **Auth**: Required
- **Response**: Success message

---

## User Role

### GET /user-role/:userId
- **Description**: Get user role status by user ID
- **Auth**: Required
- **Response**: User role status

### PUT /user-role/update-status
- **Description**: Update user status (Admin only)
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "userId": "user_id",
    "status": "active"
  }
  ```
- **Response**: Updated user status

---

## Products

### GET /products
- **Description**: List all products
- **Auth**: Public
- **Response**: Array of products

### GET /products/getAllProduct
- **Description**: Get all products (including inactive)
- **Auth**: Public
- **Response**: Array of all products

### GET /products/getProductByCategoryId/:categoryId
- **Description**: Get products by category ID
- **Auth**: Public
- **Params**: categoryId (path), page (query), limit (query)
- **Response**: Paginated products

### GET /products/search
- **Description**: Advanced search and filtering for products
- **Auth**: Public
- **Query Params**: keyword, minPrice, maxPrice, category, sortBy, sortOrder, page, limit
- **Response**: Search results with pagination

### GET /products/:id
- **Description**: Get product by ID
- **Auth**: Public
- **Response**: Product details

### POST /products
- **Description**: Create a new product
- **Auth**: Required
- **Body**: Product object
- **Response**: Created product

### PUT /products/:id
- **Description**: Update product
- **Auth**: Required
- **Body**: Product object
- **Response**: Updated product

### DELETE /products/:id
- **Description**: Delete product
- **Auth**: Required
- **Response**: Success message

---

## Categories

### GET /categories
- **Description**: List all categories
- **Auth**: Public
- **Response**: Array of categories

### POST /categories
- **Description**: Create a new category
- **Auth**: Required
- **Body**: Category object
- **Response**: Created category

### PUT /categories/:id
- **Description**: Update category
- **Auth**: Required
- **Body**: Category object
- **Response**: Updated category

### DELETE /categories/:id
- **Description**: Delete category
- **Auth**: Required
- **Response**: Success message

---

## Orders

### GET /orders
- **Description**: List all orders
- **Auth**: Required
- **Response**: Array of orders

### POST /orders
- **Description**: Create a new order
- **Auth**: Required
- **Body**: Order object
- **Response**: Created order

### GET /orders/user/:userId
- **Description**: Get orders by user ID
- **Auth**: Required
- **Response**: Array of user orders

### GET /orders/:id
- **Description**: Get order by ID
- **Auth**: Required
- **Response**: Order details

### PUT /orders/:id/status
- **Description**: Update order status
- **Auth**: Required
- **Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Response**: Updated order status

### PUT /orders/:id
- **Description**: Update order
- **Auth**: Required
- **Body**: Order object
- **Response**: Updated order

### DELETE /orders/:id
- **Description**: Delete order
- **Auth**: Required
- **Response**: Success message

---

## Cart

### GET /cart/:userId
- **Description**: Get cart for a user
- **Auth**: Public
- **Response**: Cart data

### POST /cart/add
- **Description**: Add item to cart
- **Auth**: Public
- **Body**:
  ```json
  {
    "user_id": "user_id",
    "product_id": "product_id",
    "quantity": 2,
    "price": 99.99
  }
  ```
- **Response**: Updated cart

### DELETE /cart/remove
- **Description**: Remove item from cart
- **Auth**: Public
- **Body**:
  ```json
  {
    "user_id": "user_id",
    "product_id": "product_id"
  }
  ```
- **Response**: Updated cart

### PUT /cart/update-quantity
- **Description**: Update item quantity in cart
- **Auth**: Public
- **Body**:
  ```json
  {
    "user_id": "user_id",
    "product_id": "product_id",
    "quantity": 3
  }
  ```
- **Response**: Updated cart

### DELETE /cart/clear/:userId
- **Description**: Clear user cart
- **Auth**: Public
- **Response**: Cleared cart

---

## Payments

### GET /payments
- **Description**: List all payments
- **Auth**: Required
- **Response**: Array of payments

### POST /payments
- **Description**: Create a new payment
- **Auth**: Required
- **Body**: Payment object
- **Response**: Created payment

### POST /payments/momo/sandbox
- **Description**: Initialize MoMo sandbox payment
- **Auth**: Required
- **Body**:
  ```json
  {
    "amount": 100000,
    "orderId": "ORDER123",
    "orderInfo": "ElectroStore test payment"
  }
  ```
- **Response**: MoMo payment URL

### POST /payments/momo/callback
- **Description**: MoMo payment callback endpoint
- **Auth**: Public (called by MoMo)
- **Body**: MoMo callback data
- **Response**: Payment result

### POST /payments/momo/test-result
- **Description**: Test MoMo payment result (simulated)
- **Auth**: Required
- **Body**:
  ```json
  {
    "orderId": "ORDER123",
    "success": true,
    "amount": 100000
  }
  ```
- **Response**: Test payment result

---

## Reviews

### GET /reviews
- **Description**: List all reviews
- **Auth**: Public
- **Response**: Array of reviews

### POST /reviews
- **Description**: Create a new review
- **Auth**: Required
- **Body**: Review object
- **Response**: Created review

### PUT /reviews/:id
- **Description**: Update review
- **Auth**: Required
- **Body**: Review object
- **Response**: Updated review

### DELETE /reviews/:id
- **Description**: Delete review
- **Auth**: Required
- **Response**: Success message

---

## Order History

### GET /order-history
- **Description**: List all order history entries
- **Auth**: Required
- **Response**: Array of order history entries

### POST /order-history
- **Description**: Create order history entry
- **Auth**: Public
- **Body**: Order history object
- **Response**: Created order history entry

---

## Banners

### GET /banners
- **Description**: Get all banners
- **Auth**: Public
- **Response**: Array of banners

### GET /banners/position/:position
- **Description**: Get active banners by position
- **Auth**: Public
- **Response**: Array of banners

### GET /banners/:id
- **Description**: Get banner by ID
- **Auth**: Public
- **Response**: Banner details

### POST /banners
- **Description**: Create banner (Admin only)
- **Auth**: Required (Admin)
- **Body**: Banner object
- **Response**: Created banner

### PUT /banners/:id
- **Description**: Update banner (Admin only)
- **Auth**: Required (Admin)
- **Body**: Banner object
- **Response**: Updated banner

### DELETE /banners/:id
- **Description**: Delete banner (Admin only)
- **Auth**: Required (Admin)
- **Response**: Success message

---

## Components

### GET /components
- **Description**: Get all components
- **Auth**: Public
- **Response**: Array of components

### GET /components/active
- **Description**: Get active components
- **Auth**: Public
- **Response**: Array of active components

### GET /components/type/:type
- **Description**: Get components by type
- **Auth**: Public
- **Response**: Array of components

### GET /components/position/:position
- **Description**: Get components by position
- **Auth**: Public
- **Response**: Array of components

### GET /components/:id
- **Description**: Get component by ID
- **Auth**: Public
- **Response**: Component details

### POST /components
- **Description**: Create component (Admin only)
- **Auth**: Required (Admin)
- **Body**: Component object
- **Response**: Created component

### PUT /components/:id
- **Description**: Update component (Admin only)
- **Auth**: Required (Admin)
- **Body**: Component object
- **Response**: Updated component

### DELETE /components/:id
- **Description**: Delete component (Admin only)
- **Auth**: Required (Admin)
- **Response**: Success message

---

## Footer

### GET /footer/active
- **Description**: Get active footer
- **Auth**: Public
- **Response**: Footer data

### GET /footer/:id
- **Description**: Get footer by ID
- **Auth**: Public
- **Response**: Footer details

### GET /footer
- **Description**: Get all footers (Admin only)
- **Auth**: Required (Admin)
- **Response**: Array of footers

### POST /footer
- **Description**: Create footer (Admin only)
- **Auth**: Required (Admin)
- **Body**: Footer object
- **Response**: Created footer

### PUT /footer/:id
- **Description**: Update footer (Admin only)
- **Auth**: Required (Admin)
- **Body**: Footer object
- **Response**: Updated footer

### DELETE /footer/:id
- **Description**: Delete footer (Admin only)
- **Auth**: Required (Admin)
- **Response**: Success message

---

## Coupons

### POST /coupons/verify
- **Description**: Verify coupon code
- **Auth**: Required
- **Body**:
  ```json
  {
    "code": "SAVE10",
    "totalAmount": 100.50
  }
  ```
- **Response**: Coupon validation result

### GET /coupons
- **Description**: Get all coupons (Admin only)
- **Auth**: Required (Admin)
- **Response**: Array of coupons

### POST /coupons
- **Description**: Create coupon (Admin only)
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "minPurchaseAmount": 50,
    "maxDiscountAmount": 20,
    "expiryDate": "2024-12-31T23:59:59Z",
    "usageLimit": 100
  }
  ```
- **Response**: Created coupon

### DELETE /coupons/:id
- **Description**: Delete coupon (Admin only)
- **Auth**: Required (Admin)
- **Response**: Success message

---

## Dashboard

### GET /dashboard/stats
- **Description**: Get dashboard statistics (Admin only)
- **Auth**: Required (Admin)
- **Response**: 
  ```json
  {
    "totalOrders": 150,
    "totalRevenue": 50000.50,
    "totalUsers": 45,
    "monthlyRevenue": [...],
    "topProducts": [...]
  }
  ```

---

## Summary

**Total Endpoints**: 67

**Public Endpoints**: 23
- User registration and login
- Product browsing and search
- Category listing
- Cart operations
- Banner and component viewing
- Footer viewing
- Payment callbacks

**Authenticated Endpoints**: 44
- User management
- Product management (CRUD)
- Order management
- Payment operations
- Review management
- Admin-only endpoints (Dashboard, Coupons, Banners, Components, Footer management)

**Admin-Only Endpoints**: 18
- User status updates
- Dashboard statistics
- Coupon management
- Banner management
- Component management
- Footer management

---

## Testing with Postman

1. Import this documentation as a reference
2. Set base URL: `http://localhost:8090`
3. For authenticated endpoints:
   - First call `POST /users/login` to get JWT token
   - Add token to Authorization header: `Bearer <token>`
4. For admin endpoints, ensure your user has admin role
5. Use the provided example request bodies as templates
