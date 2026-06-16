const CategoryRepository = require('../repositories/CategoryRepository')

class CategoryService {
  
  // Hàm trợ giúp để ném lỗi nghiệp vụ
  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

// Get all categories (có hỗ trợ phân trang)
  async getAllCategories(page = 1, limit = 10) {
    try {
      // Truyền page và limit xuống Repository
      return await CategoryRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllCategories]:', error);
      throw new Error('Không thể lấy danh sách danh mục');
    }
  }
  // Create a new category
  async createCategory(categoryData) {
    const { name } = categoryData;

    // Validation
    if (!name) this._throwError('Category name is required', 400);

    try {
      return await CategoryRepository.create(categoryData);
    } catch (error) {
      console.error('Service Error [createCategory]:', error);
      // Kiểm tra lỗi trùng lặp (ví dụ: MongoDB duplicate key error code 11000)
      if (error.code === 11000) {
        this._throwError('Danh mục này đã tồn tại', 409);
      }
      throw new Error('Lỗi khi tạo danh mục mới');
    }
  }
}

module.exports = new CategoryService()