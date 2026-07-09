const CategoriesService = require('../services/CategoriesService')
const { asyncHandler } = require('../middleware/asyncHandler')
const fs = require('fs')

/**
 * @desc Get all product Categories.
 * @route GET /Categories
 * @access Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const Categories = await CategoriesService.getAllCategories()
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
  const CategoriesIdToDelete = req.params.id;

  const result = await CategoriesService.deleteCategories(currentUser, CategoriesIdToDelete);

  res.success(result, 'Categories deleted successfully');
});

/**
 * @desc Update a Categories by ID.
 * @route PUT /Categories/:id
 */
const updateCategories = asyncHandler(async (req, res) => {
  const currentUser = req.user; 
  const CategoriesIdToUpdate = req.params.id;
  const userData = req.body;

  const result = await CategoriesService.updateCategories(currentUser, CategoriesIdToUpdate, userData);

  res.success(result, 'Categories updated successfully');
});

/**
 * @desc Bulk create categories.
 * @route POST /Categories/bulk
 * @access Admin
 */
const bulkCreateCategories = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const categoriesData = req.body;

  const result = await CategoriesService.bulkCreateCategories(currentUser, categoriesData);
  res.success(result, 'Categories bulk created successfully', 201);
});

/**
 * @desc Bulk create categories from Excel file.
 * @route POST /Categories/bulk/excel
 * @access Admin
 */
const bulkCreateCategoriesFromExcel = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  
  if (!req.file) {
    return res.error('Không có file được tải lên', 400);
  }

  const filePath = req.file.path;
  const result = await CategoriesService.bulkCreateCategoriesFromExcel(currentUser, filePath);

  // Delete the uploaded file after processing
  fs.unlinkSync(filePath);

  res.success(result, 'Categories bulk created from Excel successfully', 201);
});

module.exports = { getCategories, createCategories, deleteCategories, updateCategories, bulkCreateCategories, bulkCreateCategoriesFromExcel }
