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
 * @desc Get all products by category (Public)
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts(req.user, req.query.page, req.query.limit)
  res.success(products, 'Products returned successfully')
})

/**
 * @desc Get products by category id (Public)
 */
const getProductByCategoryId = asyncHandler(async (req, res) => {
  const products = await ProductService.getProductByCategoryId(req.params.categoryId, req.query.page, req.query.limit)
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

/**
 * @desc Search and filter products dynamically (Public)
 * @route GET /api/products/search
 * @access Public
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { keyword, cate_id, priceMin, priceMax, sortBy, page, limit, ram, storage, os } = req.query;
  
  // Ánh xạ các trường RAM và bộ nhớ từ query của client sang specs tương ứng của MongoDB
  const specs = {};
  if (ram) specs.memory = ram;
  if (storage) specs.storage = storage;
  if (os) specs.os = os;

  const result = await ProductService.searchProducts({
    keyword,
    cate_id,
    priceMin,
    priceMax,
    sortBy,
    specs,
    page,
    limit
  });

  res.success(result, 'Products search completed successfully');
});

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProductByCategoryId,
  searchProducts
}