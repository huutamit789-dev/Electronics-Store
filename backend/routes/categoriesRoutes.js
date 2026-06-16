// categories Routes
const express = require('express')
const { getCategories, createCategories, updateCategories, deleteCategories} = require('../controllers/categoriesController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/',authMiddleware, getCategories)
router.post('/', authMiddleware, createCategories)
router.put('/:id', authMiddleware, updateCategories)
router.delete('/:id', authMiddleware, deleteCategories)
module.exports = router
