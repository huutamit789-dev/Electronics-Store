// Product Repository
// Handles all database operations for product data
const Product = require('../models/ProductModel')

class ProductRepository {
  // Find all products
  async findAll() {
    return await Product.find().populate('category_id').lean()
  }

  // Find product by ID
  async findById(id) {
    return await Product.findById(id).populate('category_id').lean()
  }

  // Create a new product
  async create(productData) {
    const product = new Product(productData)
    return await product.save()
  }

  // Update product
  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true })
  }

  // Delete product
  async delete(id) {
    return await Product.findByIdAndDelete(id)
  }
}

module.exports = new ProductRepository()
