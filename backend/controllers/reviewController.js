const ReviewService = require('../services/ReviewService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all product reviews with user and product data.
 * @route GET /reviews
 * @access Public
 */
const getReviews = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  console.log('Current user in getReviews controller:', currentUser); // Debug log
  const reviews = await ReviewService.getAllReviews(currentUser)
  res.success(reviews, 'Reviews returned successfully')
})

/**
 * @desc Create a new product review.
 * @route POST /reviews
 * @access Public
 */
const createReview = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  console.log('Current user in createReview controller:', currentUser); // Debug log
  const newReview = await ReviewService.createReview(currentUser, req.body)
  res.success(newReview, 'Review created successfully', 201)
})



const deleteReview   = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  console.log('Current user in deleteReview controller:', currentUser); // Debug log
  const ReviewIdToDelete = req.params.id;

  const result = await ReviewService.deleteReview(currentUser, ReviewIdToDelete);

  res.success(result, 'Review deleted successfully');
});

/**
 * @desc Update a Review by ID.
 * @route PUT /Reviews/:id
 * @access Private (Admin only)
 */
const updateReview = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const ReviewIdToUpdate = req.params.id;
  const userData = req.body;
console.log('Current user in updateReview controller:', currentUser); // Debug log
  const result = await ReviewService.updateReview(currentUser, ReviewIdToUpdate, userData);

  res.success(result, 'Review updated successfully');
});
module.exports = { getReviews, createReview, deleteReview, updateReview }