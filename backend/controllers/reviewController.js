// Review Controller
// Handles HTTP requests and responses for review operations
// Delegates business logic to ReviewService
const ReviewService = require('../services/ReviewService')

async function getReviews(req, res, next) {
  try {
    const reviews = await ReviewService.getAllReviews()
    res.json(reviews)
  } catch (err) {
    next(err)
  }
}

async function createReview(req, res, next) {
  try {
    const newReview = await ReviewService.createReview(req.body)
    res.status(201).json(newReview)
  } catch (err) {
    next(err)
  }
}

module.exports = { getReviews, createReview }
