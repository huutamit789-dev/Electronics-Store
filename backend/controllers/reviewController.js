// Review Controller
// Handles product review operations
const Review = require('../models/Review')

async function getReviews(req, res) {
  try {
    const reviews = await Review.find().populate('product_id').populate('user_id').lean()
    res.json(reviews)
  } catch (err) {
    console.error('❌ Fetch reviews error:', err)
    res.status(500).json({ error: 'Could not fetch reviews' })
  }
}

async function createReview(req, res) {
  try {
    const { product_id, user_id, rating, comment } = req.body
    if (!product_id || !user_id || !rating) {
      return res.status(400).json({ error: 'product_id, user_id, and rating are required' })
    }

    const newReview = new Review({ product_id, user_id, rating, comment })
    await newReview.save()
    res.status(201).json(newReview)
  } catch (err) {
    console.error('❌ Create review error:', err)
    res.status(500).json({ error: 'Could not create review' })
  }
}

module.exports = { getReviews, createReview }
