const userPaths = require('./userPaths');
const productPaths = require('./productPaths');
const orderPaths = require('./orderPaths');
const cartPaths = require('./cartPaths');
const paymentPaths = require('./paymentPaths');
const reviewPaths = require('./reviewPaths');
const orderHistoryPaths = require('./orderHistoryPaths');
const categoriesPaths = require('./categoriesPaths');
const userRolePaths = require('./userRolePaths');
const footerPaths = require('./footerPaths');
const dashboardPaths = require('./dashboardPaths');
const couponPaths = require('./couponPaths');
const componentPaths = require('./componentPaths');
const bannerPaths = require('./bannerPaths');

module.exports = {
  ...userPaths,
  ...productPaths,
  ...orderPaths,
  ...cartPaths,
  ...paymentPaths,
  ...reviewPaths,
  ...orderHistoryPaths,
  ...categoriesPaths,
  ...userRolePaths,
  ...footerPaths,
  ...dashboardPaths,
  ...couponPaths,
  ...componentPaths,
  ...bannerPaths
};
