const ReviewRepository = require('../repositories/ReviewRepository');

class ReviewService {
  // Lấy danh sách tất cả các đánh giá
  async getAllReviews(page = 1, limit = 10) {
    return await ReviewRepository.findAll(page, limit);
  }

  // Tạo một đánh giá mới
  async createReview(reviewData) {
    const { user_id, product_id, rating } = reviewData;

    // Validation
    if (!user_id || !product_id || !rating) {
      throw new Error('user_id, product_id, và rating là bắt buộc');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating phải nằm trong khoảng từ 1 đến 5');
    }

    return await ReviewRepository.create(reviewData);
  }
}

module.exports = new ReviewService();