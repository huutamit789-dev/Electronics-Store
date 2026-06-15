// Category Controller
// Handles HTTP requests and responses for category operations
// Delegates business logic to CategoryService
const CategoryService = require('../services/CategoryService')

async function getCategories(req, res, next) {
  try {
    const categories = await CategoryService.getAllCategories()
    res.json(categories)
  } catch (err) {
    next(err)
  }
}

async function createCategory(req, res, next) {
  try {
    const newCategory = await CategoryService.createCategory(req.body)
    res.status(201).json(newCategory)
  } catch (err) {
    next(err)
  }
}

module.exports = { getCategories, createCategory }
