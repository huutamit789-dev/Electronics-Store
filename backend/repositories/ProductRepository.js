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
        .populate('cate_id')
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
  // Find all products grouped by category
  async findAllGroupedByCategory(page = 1, limit = 5) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$cate_id'
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limitNum
      },
      {
        $lookup: {
          from: 'cates',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'cate_id',
          as: 'products'
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $ifNull: [ { $arrayElemAt: ['$categoryData', 0] }, {} ] },
              { products: { $slice: ['$products', 5] } }
            ]
          }
        }
      }
    ]);

    const totalCategories = (await Product.distinct('cate_id')).length;

    return {
      categories,
      total: totalCategories,
      totalPages: Math.ceil(totalCategories / limitNum),
      currentPage: pageNum
    };
  }

  // Find products by category ID with pagination
  async findByCategoryId(categoryId, page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find({ cate_id: categoryId })
        .populate('cate_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments({ cate_id: categoryId })
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
    return await Product.findById(id).populate('cate_id').lean()
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

  // Bulk create products
  async bulkCreate(dataArray) {
    return await Product.insertMany(dataArray, { ordered: false });
  }

  /**
   * @function search
   * @description Performs advanced search and filtering on products, supporting keywords, price range, categories, tech specs, sorting, and pagination.
   * @param {Object} options - Search options including keyword, priceMin, priceMax, sortBy, specs, page, limit, cate_id.
   * @returns {Promise<Object>} Object containing paginated products, total, totalPages, and currentPage.
   */
  async search({ keyword, cate_id, priceMin, priceMax, sortBy, specs = {}, page = 1, limit = 10 }) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Lọc theo danh mục
    if (cate_id) {
      query.cate_id = cate_id;
    }

    // Lọc theo từ khóa (tìm kiếm theo tên và mô tả)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Lọc theo khoảng giá
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Lọc theo thông số kỹ thuật động (specs.memory, specs.storage, specs.os, v.v.)
    if (specs && Object.keys(specs).length > 0) {
      Object.keys(specs).forEach(key => {
        if (specs[key]) {
          query[`specs.${key}`] = { $regex: specs[key], $options: 'i' };
        }
      });
    }

    // Tùy chọn sắp xếp dữ liệu
    let sortOption = { _id: -1 }; // Mặc định là mới nhất
    if (sortBy === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sortBy === 'newest') {
      sortOption = { _id: -1 };
    }

    // Chạy song song đếm tổng số lượng và lấy dữ liệu phân trang
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('cate_id')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }
}

module.exports = new ProductRepository()
