/**
 * @file dashboardController.js
 * @description Controller that handles requests for retrieving dashboard analytics.
 * Gathers statistical metrics, chart details, and top products, returning them in a standard success response.
 */

const DashboardService = require('../services/dashboardService');
const { asyncHandler } = require('../middleware/asyncHandler');

/**
 * @desc Get all dashboard statistical data (metrics, charts, best sellers)
 * @route GET /api/dashboard/stats
 * @access Private (Admins only)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Thực hiện gọi các service tính toán số liệu thống kê song song để tối ưu hóa
  const [stats, revenueChart, topProducts] = await Promise.all([
    DashboardService.getOverviewStats(),
    DashboardService.getMonthlyRevenueChartData(),
    DashboardService.getTopSellingProducts()
  ]);

  res.success({
    stats,
    revenueChart,
    topProducts
  }, 'Dashboard statistics retrieved successfully');
});

module.exports = {
  getDashboardStats
};
