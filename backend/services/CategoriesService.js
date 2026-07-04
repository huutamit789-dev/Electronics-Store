const CategoriesRepository = require('../repositories/CategoriesRepository');
const redis = require('../config/redis');

const CACHE_TTL = 3600; // 1 giờ

class CategoriesService {
  async getAllCategories(user, page = 1, limit = 10) {
    const cacheKey = `categories:all:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await CategoriesRepository.findAll(page, limit);
    await redis.set(cacheKey, JSON.stringify(data), 'EX', CACHE_TTL);
    return data;
  }

  async _invalidateCategoryCache() {
    const keys = await redis.keys('categories:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }

// Create a new Categories
  async createCategories(user, categoryData) {
    // 1. Kiểm tra quyền (Authorization)
    if (!user || user.role !== 'admin') {
      const error = new Error('Bạn không có quyền thực hiện hành động này');
      error.status = 403;
      throw error;
    }

    const { name } = categoryData;

    // 2. Validation
    if (!name) {
      const error = new Error('Categories name is required');
      error.status = 400;
      throw error;
    }

    try {
      // 3. Thực hiện tạo trong Database
      const createdCategory = await CategoriesRepository.create(categoryData);
      await this._invalidateCategoryCache();
      return createdCategory;
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
      
      await this._invalidateCategoryCache();
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

      await this._invalidateCategoryCache();
    }
}

module.exports = new CategoriesService();
