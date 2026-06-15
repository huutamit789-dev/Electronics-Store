const userPaths = require('./userPaths');
const productPaths = require('./productPaths');
const orderPaths = require('./orderPaths');
const cartPaths = require('./cartPaths');
const paymentPaths = require('./paymentPaths');
const reviewPaths = require('./reviewPaths');
const orderHistoryPaths = require('./orderHistoryPaths');

module.exports = {
  ...require('./userPaths'),
  ...require('./productPaths'),
  ...require('./orderPaths'),
  ...require('./cartPaths'),
  ...require('./paymentPaths'),
  ...require('./reviewPaths'),
  ...require('./orderHistoryPaths')
};