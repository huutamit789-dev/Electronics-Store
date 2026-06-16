const CategoriesService = require('../services/CategoriesService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all product Categories.
 * @route GET /Categories
 * @access Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const Categories = await CategoriesService.getAllCategories(currentUser)
  res.success(Categories, 'Categories returned successfully')
})

/**
 * @desc Create a new product Categories.
 * @route POST /Categories
 * @access Public
 */
const createCategories = asyncHandler(async (req, res) => {
   const currentUser = req.user; 
  const newCategories = await CategoriesService.createCategories(currentUser, req.body)
  res.success(newCategories, 'Categories created successfully', 201)
})

const deleteCategories = asyncHandler(async (req, res) => {
  const currentUser = req.user; // Lấy từ authMiddleware
  console.log('Current user in deleteCategories controller:', currentUser); // Debug log
  const CategoriesIdToDelete = req.params.id;

  const result = await CategoriesService.deleteCategories(currentUser, CategoriesIdToDelete);

  res.success(result, 'Categories deleted successfully');
});

/**
 * @desc Update a Categories by ID.
 * @route PUT /Categories/:id
 * @access Private (Admin only)
 */
const updateCategories = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const CategoriesIdToUpdate = req.params.id;
  const userData = req.body;

  const result = await CategoriesService.updateCategories(currentUser, CategoriesIdToUpdate, userData);

  res.success(result, 'Categories updated successfully');
});

module.exports = { getCategories, createCategories, deleteCategories, updateCategories }
