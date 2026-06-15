# Models Reference

This document describes the backend Mongoose schemas, field meanings, and foreign key relationships.

## User
- `_id`: ObjectId (primary key)
- `username`: String, required
- `email`: String, required
- `password`: String, required (hash before saving)
- `phonenumber`: String, required
- `createdAt`: Date, default `Date.now`

## Category
- `_id`: ObjectId
- `name`: String, required, unique
- `description`: String

## Product
- `_id`: ObjectId
- `name`: String, required
- `description`: String
- `price`: Number, required
- `stock_quantity`: Number, default `0`
- `category_id`: ObjectId, ref `Category`

## Order
- `_id`: ObjectId
- `user_id`: ObjectId, ref `User`
- `items`: Array of objects:
  - `product_id`: ObjectId, ref `Product`
  - `quantity`: Number, required
- `total_price`: Number, required
- `status`: String, enum `['pending','completed','cancelled']`, default `pending`
- `created_at`: Date, default `Date.now`

## Cart
- `_id`: ObjectId
- `user_id`: ObjectId, ref `User`
- `items`: Array of objects:
  - `product_id`: ObjectId, ref `Product`
  - `quantity`: Number, required, min `1`
- `updated_at`: Date, default `Date.now`

## Payment
- `_id`: ObjectId
- `order_id`: ObjectId, ref `Order`
- `payment_method`: String, enum `['cod','credit_card','momo','zalopay']`
- `payment_status`: String, enum `['pending','paid','failed','refunded']`, default `pending`
- `transaction_id`: String
- `amount`: Number
- `paid_at`: Date

## Review
- `_id`: ObjectId
- `user_id`: ObjectId, ref `User`
- `product_id`: ObjectId, ref `Product`
- `rating`: Number, required, 1-5
- `comment`: String
- `created_at`: Date, default `Date.now`

## OrderHistory
- `_id`: ObjectId
- `order_id`: ObjectId, ref `Order`
- `old_status`: String
- `new_status`: String
- `changed_at`: Date, default `Date.now`
- `note`: String

## Notes
- Mongoose generates `_id` as the primary key for all schemas.
- ObjectId fields with `ref` act as foreign keys linking collections.
