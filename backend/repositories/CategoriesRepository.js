// categoriesRepository.js
const Category = require('../models/CategoryModel'); // Sửa tên file cho khớp (Ví dụ: CategoryModel)

class CategoryRepository {
  // Tìm tất cả các danh mục
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [categories, total] = await Promise.all([
      Category.find().skip(skip).limit(limitNum).sort({ name: 1 }).lean(),
      Category.countDocuments()
    ]);

    return {
      categories,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }

  async findById(id) {
    return await Category.findById(id).lean();
  }

  async create(data) {
    const newCategory = new Category(data);
    return await newCategory.save();
  }

  async update(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryRepository();