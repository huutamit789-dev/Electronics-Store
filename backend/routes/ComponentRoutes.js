// Component Routes
const express = require('express')
const { 
  getAllComponents, 
  getComponentById, 
  getComponentsByType, 
  getComponentsByPosition, 
  getActiveComponents,
  createComponent, 
  updateComponent, 
  deleteComponent 
} = require('../controllers/ComponentController')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

// Public routes
router.get('/', getAllComponents)
router.get('/active', getActiveComponents)
router.get('/type/:type', getComponentsByType)
router.get('/position/:position', getComponentsByPosition)
router.get('/:id', getComponentById)

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createComponent)
router.put('/:id', authMiddleware, adminMiddleware, updateComponent)
router.delete('/:id', authMiddleware, adminMiddleware, deleteComponent)

module.exports = router
