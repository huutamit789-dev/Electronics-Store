const CategoriesRepository = require('../repositories/CategoriesRepository');

class CategoriesService {
async getAllCategories(user, page = 1, limit = 10) {
  const allowedRoles = ['admin', 'user'];
  
  // Kiểm tra: Nếu không có user HOẶC user không có role nằm trong danh sách cho phép
  if (!user || !allowedRoles.includes(user.role)) {
    const error = new Error('Bạn không có quyền truy cập');
    error.status = 403;
    throw error;
  }
  
  return await CategoriesRepository.findAll(page, limit);
}

// Create a new Categories
  async createCategories(user, CategoriesData) {
    // 1. Kiểm tra quyền (Authorization)
    if (!user || user.role !== 'admin') {
      const error = new Error('Bạn không có quyền thực hiện hành động này');
      error.status = 403;
      throw error;
    }

    const { name } = CategoriesData;

    // 2. Validation
    if (!name) {
      const error = new Error('Categories name is required');
      error.status = 400;
      throw error;
    }

    try {
      // 3. Thực hiện tạo trong Database
      const newCategories = await CategoriesRepository.create(CategoriesData);
      return newCategories;
    } catch (error) {
      // 5. Xử lý lỗi đặc thù (DupliCategories key)
      if (error.code === 11000) {
        const err = new Error('Danh mục này đã tồn tại');
        err.status = 409;
        throw err;
      }
      throw error; 
    }
  }

    // Cập nhật Categories (Admin only)
    async updateCategories(currentUser, CategoriesId, CategoriesData) {
      if (!currentUser || currentUser.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
      if (!CategoriesId) throw new Error('Categories ID is required');

      const updated = await CategoriesRepository.update(CategoriesId, CategoriesData);
      if (!updated) throw new Error('Categories not found');
      
      return updated;
    }
  
    async deleteCategories(currentUser, CategoriesIdToDelete) {
      // 1. Kiểm tra quyền Admin
      if (!currentUser || currentUser.role !== 'admin') {
        const error = new Error('Bạn không có quyền thực hiện hành động này');
        error.status = 403;
        throw error;
      }
  
      // 2. Không cho phép Admin tự xóa chính mình (tùy chọn)
      if (currentUser._id.toString() === CategoriesIdToDelete) {
        const error = new Error('Bạn không thể tự xóa tài khoản của chính mình');
        error.status = 400;
        throw error;
      }
  
      // 3. Thực hiện xóa
      const deletedCategories = await CategoriesRepository.delete(CategoriesIdToDelete);
      if (!deletedCategories) {
        const error = new Error('Danh mục không tồn tại');
        error.status = 404;
        throw error;
      }
    }
}

module.exports = new CategoriesService();