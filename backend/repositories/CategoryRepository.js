// Category Repository
// Handles all database operations for category data
const Category = require('../models/CategoryModel') 

class CategoryRepository {
  // Find all categories with pagination
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

  // Find category by ID
  async findById(id) {
    return await Category.findById(id).lean()
  }

  // Create a new category
  async create(categoryData) {
    const category = new Category(categoryData)
    return await category.save()
  }

  // Update category
  async update(id, categoryData) {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true })
  }

  // Delete category
  async delete(id) {
    return await Category.findByIdAndDelete(id)
  }
}

module.exports = new CategoryRepository()
