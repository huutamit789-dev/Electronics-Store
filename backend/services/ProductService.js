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

  /**
   * @function searchProducts
   * @description Service method to search and filter products. Bypasses Redis cache as dynamic search param combinations are highly variable.
   * @param {Object} queryOptions - Search parameters from controller.
   * @returns {Promise<Object>} Search results containing products, total, totalPages, and currentPage.
   */
  async searchProducts(queryOptions) {
    return await ProductRepository.search(queryOptions);
  }

  async bulkCreateProductsFromExcel(user, filePath) {
    // 1. Kiểm tra quyền (Authorization)
    if (!user || user.role !== 'admin') {
      const error = new Error('Bạn không có quyền thực hiện hành động này');
      error.status = 403;
      throw error;
    }

    const XLSX = require('xlsx');
    const Product = require('../models/ProductModel');
    const Category = require('../models/CategoryModel');
    
    try {
      // 2. Đọc file Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // 3. Chuyển đổi sang JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        const error = new Error('File Excel không có dữ liệu');
        error.status = 400;
        throw error;
      }

      // 4. Lấy danh sách categories để map cate_id
      const categories = await Category.find().lean();
      const categoryMap = new Map();
      categories.forEach(cat => {
        categoryMap.set(cat.name.toLowerCase().trim(), cat._id);
      });
      
      console.log('Available categories:', categories.map(c => c.name));

      // 5. Validate và chuẩn hóa dữ liệu
      const productsData = [];
      const seenNames = new Set(); // Để lọc trùng trong file Excel
      
      console.log('Excel data rows:', jsonData.length);
      
      // Log first row keys to debug
      if (jsonData.length > 0) {
        console.log('First row keys:', Object.keys(jsonData[0]));
        console.log('First row data:', jsonData[0]);
      }
      
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Map các trường từ Excel
        const categoryName = row.category || row.Category || row.DanhMuc || row.danhMuc || row.cate_id || row['Danh mục'] || row['danh mục'] || row['Danh mục (category) (*)'] || row['Danh mục (category)'];
        const cate_id = categoryName ? categoryMap.get(categoryName.toLowerCase().trim()) : null;

        console.log(`Row ${i + 2}: categoryName="${categoryName}", cate_id=${cate_id}`);

        const product = {
          name: row.name || row.Name || row.Ten || row.ten || row['Tên sản phẩm'] || row['tên sản phẩm'] || row['Tên'] || row['tên'] || row['Tên sản phẩm (name) (*)'] || row['Tên sản phẩm (name)'],
          description: row.description || row.Description || row.MoTa || row.moTa || row['Mô tả'] || row['mô tả'] || row['Mô tả (description)'] || row['Mô tả (description)'],
          price: row.price || row.Price || row.Gia || row.gia || row['Giá (VNĐ)'] || row['giá (VNĐ)'] || row['Giá'] || row['giá'] || row['Giá bán (price) (*)'] || row['Giá bán (price)'],
          stock_quantity: row.stock_quantity || row.stock || row.SoLuong || row.soLuong || row['Số lượng tồn'] || row['số lượng tồn'] || row['Số lượng'] || row['số lượng'] || row['Số lượng tồn (stock_quantity)'] || row['Số lượng tồn (stock_quantity)'],
          image_url: row.image_url || row.image || row.Image || row.Anh || row['Đường dẫn ảnh (URL)'] || row['đường dẫn ảnh (URL)'] || row['Đường dẫn ảnh'] || row['đường dẫn ảnh'] || row['Đường dẫn ảnh (image_url)'] || row['Đường dẫn ảnh (image_url)'],
          cate_id: cate_id
        };

        console.log(`Row ${i + 2}: product.name="${product.name}", product.price="${product.price}"`);

        // Validate required fields
        if (!product.name) {
          const error = new Error(`Dòng ${(i + 2)} trong Excel thiếu tên sản phẩm`);
          error.status = 400;
          throw error;
        }

        // Xử lý giá: loại bỏ dấu chấm phân cách hàng nghìn
        let priceValue = product.price;
        if (typeof priceValue === 'string') {
          priceValue = priceValue.replace(/\./g, '').replace(/,/g, '');
          priceValue = parseFloat(priceValue);
        }

        console.log(`Row ${i + 2}: priceValue=${priceValue}`);

        if (!priceValue || priceValue <= 0) {
          const error = new Error(`Dòng ${(i + 2)} trong Excel thiếu giá hoặc giá không hợp lệ`);
          error.status = 400;
          throw error;
        }

        product.price = priceValue;

        if (!product.cate_id) {
          const error = new Error(`Dòng ${(i + 2)} trong Excel: danh mục "${categoryName}" không tồn tại`);
          error.status = 400;
          throw error;
        }

        // Lọc bỏ trùng tên trong file Excel (case-insensitive)
        const normalizedName = product.name.toLowerCase().trim();
        if (seenNames.has(normalizedName)) {
          continue; // Bỏ qua nếu trùng trong file
        }
        seenNames.add(normalizedName);

        productsData.push(product);
      }

      // 6. Lấy danh sách tên sản phẩm đã tồn tại trong database
      const existingProducts = await Product.find({ 
        name: { $in: productsData.map(p => p.name) } 
      }).select('name').lean();
      
      const existingNames = new Set(
        existingProducts.map(p => p.name.toLowerCase().trim())
      );

      // 7. Lọc bỏ các sản phẩm đã tồn tại trong database
      const newProducts = productsData.filter(p => 
        !existingNames.has(p.name.toLowerCase().trim())
      );

      if (newProducts.length === 0) {
        return {
          success: true,
          created: 0,
          total: productsData.length,
          skipped: productsData.length,
          message: 'Tất cả sản phẩm đã tồn tại trong database'
        };
      }

      // 8. Thực hiện tạo hàng loạt trong Database
      const createdProducts = await ProductRepository.bulkCreate(newProducts);
      await this._invalidateProductCache();
      
      return {
        success: true,
        created: createdProducts.length,
        total: productsData.length,
        skipped: productsData.length - createdProducts.length,
        data: createdProducts,
        message: `Đã thêm ${createdProducts.length} sản phẩm, bỏ qua ${productsData.length - createdProducts.length} sản phẩm trùng`
      };
    } catch (error) {
      if (error.status) throw error;
      
      const err = new Error('Lỗi khi đọc file Excel: ' + error.message);
      err.status = 400;
      throw err;
    }
  }
}

module.exports = new ProductService();
