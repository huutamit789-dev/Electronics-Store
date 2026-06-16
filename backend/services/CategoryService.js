const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryService {
  // Nhận vào user object để kiểm tra quyền
  async getAllCategories(user, page = 1, limit = 10) {
    // 1. Kiểm tra quyền (Authorization)
    if (!user || user.role !== 'admin') {
      const error = new Error('Bạn không có quyền truy cập');
      error.status = 403; // Forbidden
      throw error;
    }
    return await CategoryRepository.findAll(page, limit);
  }

// Create a new category
  async createCategory(user, categoryData) {
    // 1. Kiểm tra quyền (Authorization)
    if (!user || user.role !== 'admin') {
      const error = new Error('Bạn không có quyền thực hiện hành động này');
      error.status = 403;
      throw error;
    }

    const { name } = categoryData;

    // 2. Validation
    if (!name) {
      const error = new Error('Category name is required');
      error.status = 400;
      throw error;
    }

    try {
      // 3. Thực hiện tạo trong Database
      const newCategory = await CategoryRepository.create(categoryData);
      return newCategory;
    } catch (error) {
      // 5. Xử lý lỗi đặc thù (Duplicate key)
      if (error.code === 11000) {
        const err = new Error('Danh mục này đã tồn tại');
        err.status = 409;
        throw err;
      }
      throw error; 
    }
  }
}

module.exports = new CategoryService();