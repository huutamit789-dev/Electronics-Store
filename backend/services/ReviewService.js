const ReviewRepository = require('../repositories/ReviewRepository');

class ReviewService {
  // Lấy danh sách tất cả các đánh giá
  async getAllReviews(page = 1, limit = 10) {
    return await ReviewRepository.findAll(page, limit);
  }

  // Tạo một đánh giá mới
  async createReview(user, reviewData) {
    const { author, rating, comment } = reviewData;

    // Validation
    if (!author || !rating || !comment) {
      throw new Error('author, rating, và comment là bắt buộc');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating phải nằm trong khoảng từ 1 đến 5');
    }

    return await ReviewRepository.create(reviewData);
  }

  // Cập nhật đánh giá
  async updateReview(user, reviewId, reviewData) {
    const { rating, comment } = reviewData;

    if (!rating && !comment) {
      throw new Error('Rating hoặc comment là bắt buộc');
    }

    if (rating && (rating < 1 || rating > 5)) {
      throw new Error('Rating phải nằm trong khoảng từ 1 đến 5');
    }

    return await ReviewRepository.update(reviewId, reviewData);
  }

  // Xóa đánh giá
  async deleteReview(user, reviewId) {
    return await ReviewRepository.delete(reviewId);
  }
}

module.exports = new ReviewService();