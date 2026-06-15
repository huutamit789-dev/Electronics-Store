// Category Repository
// Handles all database operations for category data
const Category = require('../models/CartModel')

class CategoryRepository {
  // Find all categories
  async findAll() {
    return await Category.find().lean()
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
