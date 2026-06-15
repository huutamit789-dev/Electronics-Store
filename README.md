# Electronics Store

A full-stack electronics store application with a clean backend architecture and reusable API design.

## Project overview

- `backend/` contains the Express.js API, Mongoose models, controllers, and routes.
- `frontend/` contains the client application.

## Tech stack

- Node.js + Express.js
- MongoDB + Mongoose
- bcrypt for password hashing
- dotenv for environment configuration
- cors for API access

## Model documentation

Detailed model reference is available at `docs/models.md`.

## Backend setup

1. `cd backend`
2. `npm install`
3. Create `.env` with:
	```env
	DB_STRING=mongodb://admin:password123@localhost:27017/
	PORT=8000
	```
4. `npm start`
