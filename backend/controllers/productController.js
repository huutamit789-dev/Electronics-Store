// Product Controller
// Handles product-related CRUD operations
const Product = require('../models/Product')

async function getProducts(req, res) {
  try {
    const products = await Product.find().populate('category_id').lean()
    res.json(products)
  } catch (err) {
    console.error('❌ Fetch products error:', err)
    res.status(500).json({ error: 'Could not fetch products' })
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, stock_quantity, image_url, category_id } = req.body
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'name, price, and category_id are required' })
    }

    const newProduct = new Product({ name, description, price, stock_quantity, image_url, category_id })
    await newProduct.save()
    res.status(201).json(newProduct)
  } catch (err) {
    console.error('❌ Create product error:', err)
    res.status(500).json({ error: 'Could not create product' })
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    console.error('❌ Update product error:', err)
    res.status(500).json({ error: 'Could not update product' })
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error('❌ Delete product error:', err)
    res.status(500).json({ error: 'Could not delete product' })
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }
