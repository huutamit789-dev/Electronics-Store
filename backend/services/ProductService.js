const ProductRepository = require('../repositories/ProductRepository')

class ProductService {

  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

  // Get all products
  async getAllProducts(page = 1, limit = 10) {
    try {
      return await ProductRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllProducts]:', error);
      throw new Error('Lỗi truy xuất danh sách sản phẩm');
    }
  }

  // Get product by ID
  async getProductById(id) {
    if (!id) this._throwError('Product ID is required', 400);

    try {
      const product = await ProductRepository.findById(id);
      if (!product) this._throwError('Product not found', 404);
      return product;
    } catch (error) {
      console.error(`Service Error [getProductById - ${id}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi khi lấy thông tin sản phẩm');
    }
  }

  // Create a new product
  async createProduct(productData) {
    const { name, price, category_id } = productData;

    // Validation
    if (!name || !price || !category_id) this._throwError('name, price, and category_id are required', 400);
    if (price <= 0) this._throwError('price must be greater than 0', 400);

    try {
      return await ProductRepository.create(productData);
    } catch (error) {
      console.error('Service Error [createProduct]:', error);
      throw new Error('Không thể tạo sản phẩm mới');
    }
  }

  // Update product
  async updateProduct(id, productData) {
    if (!id) this._throwError('Product ID is required', 400);

    try {
      const updated = await ProductRepository.update(id, productData);
      if (!updated) this._throwError('Product not found', 404);
      return updated;
    } catch (error) {
      console.error(`Service Error [updateProduct - ${id}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi khi cập nhật sản phẩm');
    }
  }

  // Delete product
  async deleteProduct(id) {
    if (!id) this._throwError('Product ID is required', 400);

    try {
      const deleted = await ProductRepository.delete(id);
      if (!deleted) this._throwError('Product not found', 404);
      return deleted;
    } catch (error) {
      console.error(`Service Error [deleteProduct - ${id}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi khi xóa sản phẩm');
    }
  }
}

module.exports = new ProductService()