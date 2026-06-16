const ReviewRepository = require('../repositories/ReviewRepository')

class ReviewService {

  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

  // Get all reviews
  async getAllReviews(page = 1, limit = 10 ) {
    try {
      return await ReviewRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllReviews]:', error);
      throw new Error('Lỗi truy xuất danh sách đánh giá');
    }
  }

  // Create a new review
  async createReview(reviewData) {
    const { user_id, product_id, rating } = reviewData;

    // Validation
    if (!user_id || !product_id || !rating) {
      this._throwError('user_id, product_id, và rating là bắt buộc', 400);
    }

    if (rating < 1 || rating > 5) {
      this._throwError('Rating phải nằm trong khoảng từ 1 đến 5', 400);
    }

    try {
      return await ReviewRepository.create(reviewData);
    } catch (error) {
      console.error('Service Error [createReview]:', error);
      throw new Error('Không thể tạo đánh giá mới');
    }
  }
}

module.exports = new ReviewService()