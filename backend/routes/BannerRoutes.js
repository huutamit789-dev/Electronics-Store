// Banner Routes
const express = require('express')
const { getAllBanners, getBannerById, getActiveBannersByPosition, createBanner, updateBanner, deleteBanner } = require('../controllers/BannerController')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

// Public routes
router.get('/', getAllBanners)
router.get('/position/:position', getActiveBannersByPosition)
router.get('/:id', getBannerById)

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createBanner)
router.put('/:id', authMiddleware, adminMiddleware, updateBanner)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBanner)

module.exports = router
