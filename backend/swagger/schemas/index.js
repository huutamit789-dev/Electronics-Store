const User = require('./UserSchema');
const Product = require('./ProductSchema');
const Order = require('./OrderSchema');
const Cart = require('./CartSchema');
const Payment = require('./PaymentSchema');
const Review = require('./ReviewSchema');
const Common = require('./CommonSchema');
const Categories = require('./CategoriesSchema');
module.exports = {
  ...User,
  ...Product,
  ...Order,
  ...Cart,
  ...Payment,
  ...Review,
  ...Common,
  ...Categories
};