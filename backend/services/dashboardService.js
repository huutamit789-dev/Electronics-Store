/**
 * @file dashboardService.js
 * @description Service containing business logic for calculating admin dashboard statistics.
 * Handles database aggregation and queries for revenue, orders, user registrations, and products.
 */

const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

class DashboardService {
  /**
   * @function getOverviewStats
   * @description Calculates overview metrics including total, monthly, yearly completed revenues, order counts, registered users, and low stock products.
   * @returns {Promise<Object>} Statistics overview object.
   */
  async getOverviewStats() {
    const now = new Date();
    
    // Khởi tạo khoảng thời gian cho tháng hiện tại
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Khởi tạo khoảng thời gian cho năm hiện tại
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    // 1. Tính toán doanh thu từ các đơn hàng hoàn thành (status: 'completed')
    const completedOrders = await Order.find({ status: 'completed' }).lean();
    
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;

    completedOrders.forEach(order => {
      totalRevenue += order.total_price;
      const orderDate = new Date(order.created_at);
      
      if (orderDate >= startOfMonth && orderDate <= endOfMonth) {
        monthlyRevenue += order.total_price;
      }
      if (orderDate >= startOfYear && orderDate <= endOfYear) {
        yearlyRevenue += order.total_price;
      }
    });

    // 2. Thống kê số lượng đơn hàng
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // 3. Thống kê số lượng người dùng đăng ký (role: 'user')
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 4. Thống kê số lượng sản phẩm
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock_quantity: { $lte: 10 } });

    return {
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      totalOrders,
      pendingOrders,
      totalUsers,
      totalProducts,
      lowStockProducts
    };
  }

  /**
   * @function getMonthlyRevenueChartData
   * @description Groups revenue from completed orders by month of the current year (12 months).
   * @returns {Promise<Array<Object>>} Chart data representing monthly revenues.
   */
  async getMonthlyRevenueChartData() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    // Gom nhóm doanh thu theo tháng bằng Aggregation
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          created_at: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$created_at' },
          revenue: { $sum: '$total_price' }
        }
      }
    ]);

    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    // Ánh xạ kết quả aggregation vào đủ 12 tháng để vẽ biểu đồ
    const chartData = months.map((m, index) => {
      const monthNum = index + 1;
      const found = monthlyStats.find(item => item._id === monthNum);
      return {
        month: m,
        revenue: found ? found.revenue : 0
      };
    });

    return chartData;
  }

  /**
   * @function getTopSellingProducts
   * @description Aggregates completed orders to find the top 5 best selling products by quantity.
   * @returns {Promise<Array<Object>>} Top selling products with populated info.
   */
  async getTopSellingProducts() {
    const topProducts = await Order.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.product_id',
          soldQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { soldQuantity: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $project: {
          _id: 1,
          soldQuantity: 1,
          name: '$productDetails.name',
          price: '$productDetails.price',
          image_url: '$productDetails.image_url',
          stock_quantity: '$productDetails.stock_quantity'
        }
      }
    ]);

    return topProducts;
  }
}

module.exports = new DashboardService();
