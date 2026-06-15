// Category Service
// Handles business logic and validation for category operations
const CategoryRepository = require('../repositories/CategoryRepository')

class CategoryService {
  // Get all categories
  async getAllCategories() {
    return await CategoryRepository.findAll()
  }

  // Create a new category
  async createCategory(categoryData) {
    const { name } = categoryData

    // Validation
    if (!name) {
      const error = new Error('Category name is required')
      error.status = 400
      throw error
    }

    const newCategory = await CategoryRepository.create(categoryData)
    return newCategory
  }
}

module.exports = new CategoryService()
