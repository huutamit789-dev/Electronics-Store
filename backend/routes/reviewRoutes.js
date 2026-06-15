// Review Routes
const express = require('express')
const { getReviews, createReview } = require('../controllers/reviewController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getReviews)
router.post('/', authMiddleware, createReview)

module.exports = router
