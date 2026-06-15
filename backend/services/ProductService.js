// Product Service
// Handles business logic and validation for product operations
const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  // Get all products
  async getAllProducts() {
    return await ProductRepository.findAll()
  }

  // Create a new product
  async createProduct(productData) {
    const { name, price, category_id } = productData

    // Validation
    if (!name || !price || !category_id) {
      const error = new Error('name, price, and category_id are required')
      error.status = 400
      throw error
    }

    if (price <= 0) {
      const error = new Error('price must be greater than 0')
      error.status = 400
      throw error
    }

    const newProduct = await ProductRepository.create(productData)
    return newProduct
  }

  // Update product
  async updateProduct(id, productData) {
    if (!id) {
      const error = new Error('Product ID is required')
      error.status = 400
      throw error
    }

    const updated = await ProductRepository.update(id, productData)
    if (!updated) {
      const error = new Error('Product not found')
      error.status = 404
      throw error
    }

    return updated
  }

  // Delete product
  async deleteProduct(id) {
    if (!id) {
      const error = new Error('Product ID is required')
      error.status = 400
      throw error
    }

    const deleted = await ProductRepository.delete(id)
    if (!deleted) {
      const error = new Error('Product not found')
      error.status = 404
      throw error
    }

    return deleted
  }
}

module.exports = new ProductService()
