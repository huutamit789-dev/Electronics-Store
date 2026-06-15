const ReviewService = require('../services/ReviewService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all product reviews with user and product data.
 * @route GET /reviews
 * @access Public
 */
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewService.getAllReviews()
  res.success(reviews, 'Reviews returned successfully')
})

/**
 * @desc Create a new product review.
 * @route POST /reviews
 * @access Public
 */
const createReview = asyncHandler(async (req, res) => {
  const newReview = await ReviewService.createReview(req.body)
  res.success(newReview, 'Review created successfully', 201)
})

module.exports = { getReviews, createReview }
