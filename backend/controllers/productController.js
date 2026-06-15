const ProductService = require('../services/ProductService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all products with category data.
 * @route GET /products
 * @access Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts()
  res.success(products, 'Products returned successfully')
})

/**
 * @desc Get product detail by ID.
 * @route GET /products/:id
 * @access Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await ProductService.getProductById(id)
  res.success(product, 'Product returned successfully')
})

/**
 * @desc Create a new product.
 * @route POST /products
 * @access Public
 */
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await ProductService.createProduct(req.body)
  res.success(newProduct, 'Product created successfully', 201)
})

/**
 * @desc Update an existing product by ID.
 * @route PUT /products/:id
 * @access Public
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const updated = await ProductService.updateProduct(id, req.body)
  res.success(updated, 'Product updated successfully')
})

/**
 * @desc Delete an existing product by ID.
 * @route DELETE /products/:id
 * @access Public
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  await ProductService.deleteProduct(id)
  res.success(null, 'Product deleted successfully')
})

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
