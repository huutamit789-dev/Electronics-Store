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
  searchProducts,
  bulkCreateProductsFromExcel
} = require('../controllers/productController')
const { authMiddleware } = require('../middleware/authMiddleware')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'products-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.xlsx', '.xls']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

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
router.post('/bulk/excel', authMiddleware, upload.single('file'), bulkCreateProductsFromExcel)
router.put('/:id', authMiddleware, updateProduct)
router.delete('/:id', authMiddleware, deleteProduct)

module.exports = router
