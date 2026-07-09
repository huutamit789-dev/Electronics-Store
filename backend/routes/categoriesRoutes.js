// categories Routes
const express = require('express')
const { getCategories, createCategories, updateCategories, deleteCategories, bulkCreateCategories, bulkCreateCategoriesFromExcel} = require('../controllers/categoriesController')
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
    cb(null, 'categories-' + uniqueSuffix + path.extname(file.originalname))
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

router.get('/', getCategories)
router.post('/', authMiddleware, createCategories)
router.post('/bulk', authMiddleware, bulkCreateCategories)
router.post('/bulk/excel', authMiddleware, upload.single('file'), bulkCreateCategoriesFromExcel)
router.put('/:id', authMiddleware, updateCategories)
router.delete('/:id', authMiddleware, deleteCategories)
module.exports = router