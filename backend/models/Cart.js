const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: { // Added price field
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false }); // _id: false means Mongoose won't create an _id for subdocuments by default

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
    unique: true, // Each user should have only one cart
  },
  items: [cartItemSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Cart', cartSchema);