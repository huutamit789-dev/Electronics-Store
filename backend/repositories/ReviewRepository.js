// Review Repository
// Handles all database operations for review data
const Review = require('../models/ReviewModel')

class ReviewRepository {
  // Find all reviews with pagination
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('user_id', '-password')
        .populate('product_id')
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments()
    ]);

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
}
  // Create a new review
  async create(reviewData) {
    const review = new Review(reviewData)
    return await review.save()
  }

  // Update review
  async update(reviewId, reviewData) {
    return await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });
  }

  // Delete review
  async delete(reviewId) {
    return await Review.findByIdAndDelete(reviewId);
  }
}

module.exports = new ReviewRepository()
