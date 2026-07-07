// Product Routes
const express = require('express')
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProductByCategoryId,
  searchProducts 
} = require('../controllers/productController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getProducts)
router.get('/getAllProduct', getAllProducts)
router.get('/getProductByCategoryId/:categoryId', getProductByCategoryId)

/**
 * @route GET /api/products/search
 * @description Advanced search and filtering for products (by keyword, price, specs, sorting, pagination).
 * @access Public
 */
router.get('/search', searchProducts)

router.get('/:id', getProductById)
router.post('/', authMiddleware, createProduct)
router.put('/:id', authMiddleware, updateProduct)
router.delete('/:id', authMiddleware, deleteProduct)

module.exports = router
