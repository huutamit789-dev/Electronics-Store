// Review Service
// Handles business logic and validation for review operations
const ReviewRepository = require('../repositories/ReviewRepository')

class ReviewService {
  // Get all reviews
  async getAllReviews() {
    return await ReviewRepository.findAll()
  }

  // Create a new review
  async createReview(reviewData) {
    const { user_id, product_id, rating } = reviewData

    // Validation
    if (!user_id || !product_id || !rating) {
      const error = new Error('user_id, product_id, and rating are required')
      error.status = 400
      throw error
    }

    if (rating < 1 || rating > 5) {
      const error = new Error('Rating must be between 1 and 5')
      error.status = 400
      throw error
    }

    const newReview = await ReviewRepository.create(reviewData)
    return newReview
  }
}

module.exports = new ReviewService()
