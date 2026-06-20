// Footer Routes
const express = require('express')
const { getActiveFooter, getFooterById, getAllFooters, createFooter, updateFooter, deleteFooter } = require('../controllers/FooterController')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

// Public routes
router.get('/active', getActiveFooter)
router.get('/:id', getFooterById)

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, getAllFooters)
router.post('/', authMiddleware, adminMiddleware, createFooter)
router.put('/:id', authMiddleware, adminMiddleware, updateFooter)
router.delete('/:id', authMiddleware, adminMiddleware, deleteFooter)

module.exports = router
