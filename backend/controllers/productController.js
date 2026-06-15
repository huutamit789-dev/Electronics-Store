// Product Controller
// Handles HTTP requests and responses for product operations
// Delegates business logic to ProductService
const ProductService = require('../services/ProductService')

async function getProducts(req, res, next) {
  try {
    const products = await ProductService.getAllProducts()
    res.json(products)
  } catch (err) {
    next(err)
  }
}

async function createProduct(req, res, next) {
  try {
    const newProduct = await ProductService.createProduct(req.body)
    res.status(201).json(newProduct)
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const updated = await ProductService.updateProduct(id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params
    await ProductService.deleteProduct(id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }
