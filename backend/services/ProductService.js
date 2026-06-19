const ProductRepository = require('../repositories/ProductRepository');

class ProductService {
 // Lấy tất cả sản phẩm (Public)
  async getAllProducts(user, page = 1, limit = 10) {
    return await ProductRepository.findAll(page, limit);
  }

  // Lấy tất cả sản phẩm theo danh mục
  async getAllProductsByCategory(page = 1, limit = 5) {
    return await ProductRepository.findAllGroupedByCategory(page, limit);
  }

  async getProductByCategoryId(categoryId, page = 1, limit = 10) {
    if (!categoryId) throw new Error('Category ID is required');

    return await ProductRepository.findByCategoryId(categoryId, page, limit);
  }

  // Lấy sản phẩm theo ID (Public)
  async getProductById(id) {
    if (!id) throw new Error('Product ID is required');

    const product = await ProductRepository.findById(id);
    if (!product) throw new Error('Product not found');
    
    return product;
  }

  // Tạo sản phẩm mới (Admin only)
  async createProduct(user, productData) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');

    const { name, price, cate_id } = productData;

    if (!name || !price || !cate_id) throw new Error('name, price, and cate_id are required');
    if (price <= 0) throw new Error('price must be greater than 0');

    return await ProductRepository.create(productData);
  }

  // Cập nhật sản phẩm (Admin only)
  async updateProduct(user, id, productData) {
    // 1. Kiểm tra quyền hạn
    if (!user || user.role !== 'admin') {
      throw new Error('Bạn không có quyền thực hiện tác vụ này');
    }
    if (!id) throw new Error('Product ID is required');
    if (!productData) throw new Error('Product data is required');
    const updatedProduct = await ProductRepository.update(id, productData);

    if (!updatedProduct) {
      throw new Error('Product not found or update failed');
    }

    return updatedProduct;
  }

  // Xóa sản phẩm (Admin only)
  async deleteProduct(user, id) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
    if (!id) throw new Error('Product ID is required');

    const deleted = await ProductRepository.delete(id);
    if (!deleted) throw new Error('Product not found');
    
    return deleted;
  }
}

module.exports = new ProductService();
