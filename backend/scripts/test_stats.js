/**
 * @file test_stats.js
 * @description Scratch script to test DashboardService aggregation methods locally.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const DashboardService = require('../services/dashboardService');

const dbUri = `${process.env.DB_STRING}${process.env.DB_NAME || 'ElectronicsDB'}?authSource=admin`;

console.log('Connecting to database at:', dbUri);

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB database successfully!');
    
    console.log('\n--- Testing overview stats ---');
    const stats = await DashboardService.getOverviewStats();
    console.log(JSON.stringify(stats, null, 2));

    console.log('\n--- Testing monthly revenue chart ---');
    const chartData = await DashboardService.getMonthlyRevenueChartData();
    console.log(JSON.stringify(chartData, null, 2));

    console.log('\n--- Testing top selling products ---');
    const topProducts = await DashboardService.getTopSellingProducts();
    console.log(JSON.stringify(topProducts, null, 2));

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection or execution failed:', err);
    process.exit(1);
  });
