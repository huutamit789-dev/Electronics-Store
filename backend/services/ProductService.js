const ProductRepository = require('../repositories/ProductRepository');
const redis = require('../config/redis');

const CACHE_TTL = 3600; // 1 giờ
class ProductService {
 // Lấy tất cả sản phẩm (Public)
  async getAllProducts(user, page = 1, limit = 10) {
    const cacheKey = `products:all:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await ProductRepository.findAll(page, limit);
    await redis.set(cacheKey, JSON.stringify(data), 'EX', CACHE_TTL);
    return data;
  }

  // Helper method để xóa cache khi có thay đổi dữ liệu
  async _invalidateProductCache() {
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }

  // Lấy tất cả sản phẩm theo danh mục
  async getAllProductsByCategory(page = 1, limit = 5) {
    const cacheKey = `products:allGroupedByCategory:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await ProductRepository.findAllGroupedByCategory(page, limit);
    await redis.set(cacheKey, JSON.stringify(data), 'EX', CACHE_TTL);
    return data;
  }

  async getProductByCategoryId(categoryId, page = 1, limit = 10) {
    if (!categoryId) throw new Error('Category ID is required');

    const cacheKey = `products:category:${categoryId}:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await ProductRepository.findByCategoryId(categoryId, page, limit);
    await redis.set(cacheKey, JSON.stringify(data), 'EX', CACHE_TTL);
    return data;
  }

  // Lấy sản phẩm theo ID (Public)
  async getProductById(id) {
    if (!id) throw new Error('Product ID is required');

    const cacheKey = `products:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const product = await ProductRepository.findById(id);
    if (!product) throw new Error('Product not found');
    
    await redis.set(cacheKey, JSON.stringify(product), 'EX', CACHE_TTL);
    return product;
  }

  // Tạo sản phẩm mới (Admin only)
  async createProduct(user, productData) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');

    const { name, price, cate_id } = productData;

    if (!name || !price || !cate_id) throw new Error('name, price, and cate_id are required');
    if (price <= 0) throw new Error('price must be greater than 0');

    const newProduct = await ProductRepository.create(productData);
    await this._invalidateProductCache();
    return newProduct;
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

    await this._invalidateProductCache();
    return updatedProduct;
  }

  // Xóa sản phẩm (Admin only)
  async deleteProduct(user, id) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
    if (!id) throw new Error('Product ID is required');

    const deleted = await ProductRepository.delete(id);
    if (!deleted) throw new Error('Product not found');
    
    await this._invalidateProductCache();
    return deleted;
  }
}

module.exports = new ProductService();
