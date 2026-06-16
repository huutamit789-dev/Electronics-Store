// Category Routes
const express = require('express')
const { getCategories, createCategory } = require('../controllers/categoryController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/',authMiddleware, getCategories)
router.post('/', authMiddleware, createCategory)

module.exports = router
