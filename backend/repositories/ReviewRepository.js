// Review Repository
// Handles all database operations for review data
const Review = require('../models/Review')

class ReviewRepository {
  // Find all reviews
  async findAll() {
    return await Review.find().populate('user_id', '-password').populate('product_id').lean()
  }

  // Create a new review
  async create(reviewData) {
    const review = new Review(reviewData)
    return await review.save()
  }
}

module.exports = new ReviewRepository()
