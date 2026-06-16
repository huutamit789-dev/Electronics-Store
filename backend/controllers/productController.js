const ProductService = require('../services/ProductService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all products (Public)
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts(req.user, req.query.page, req.query.limit)
  res.success(products, 'Products returned successfully')
})

/**
 * @desc Get product detail (Public)
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id)
  res.success(product, 'Product returned successfully')
})

/**
 * @desc Create a new product (Admin Only)
 */
const createProduct = asyncHandler(async (req, res) => {
  // Truyền req.user vào để Service kiểm tra quyền
  const newProduct = await ProductService.createProduct(req.user, req.body)
  res.success(newProduct, 'Product created successfully', 201)
})

/**
 * @desc Update a product (Admin Only)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const updated = await ProductService.updateProduct(req.user, req.params.id, req.body)
  res.success(updated, 'Product updated successfully')
})

/**
 * @desc Delete a product (Admin Only)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await ProductService.deleteProduct(req.user, req.params.id)
  res.success(null, 'Product deleted successfully')
})

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }