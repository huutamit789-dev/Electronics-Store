const CategoryService = require('../services/CategoryService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all product categories.
 * @route GET /categories
 * @access Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const categories = await CategoryService.getAllCategories(currentUser)
  res.success(categories, 'Categories returned successfully')
})

/**
 * @desc Create a new product category.
 * @route POST /categories
 * @access Public
 */
const createCategory = asyncHandler(async (req, res) => {
   const currentUser = req.user; 
  const newCategory = await CategoryService.createCategory(currentUser, req.body)
  res.success(newCategory, 'Category created successfully', 201)
})

module.exports = { getCategories, createCategory }
