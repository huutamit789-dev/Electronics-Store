// Category Controller
// Handles category-related CRUD operations
const Category = require('../models/Category')

async function getCategories(req, res) {
  try {
    const categories = await Category.find().lean()
    res.json(categories)
  } catch (err) {
    console.error('❌ Fetch categories error:', err)
    res.status(500).json({ error: 'Could not fetch categories' })
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }

    const newCategory = new Category({ name, description })
    await newCategory.save()
    res.status(201).json(newCategory)
  } catch (err) {
    console.error('❌ Create category error:', err)
    res.status(500).json({ error: 'Could not create category' })
  }
}

module.exports = { getCategories, createCategory }
