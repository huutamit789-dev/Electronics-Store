// Product Repository
// Handles all database operations for product data
const Product = require('../models/ProductModel')

class ProductRepository {
  // Find all products with pagination
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Chạy song song truy vấn dữ liệu và đếm tổng
    const [products, total] = await Promise.all([
      Product.find()
        .populate('category_id')
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments()
    ]);

    return {
      products,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
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
