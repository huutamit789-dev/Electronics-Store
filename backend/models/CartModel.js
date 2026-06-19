const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 } // Added price field
  }],
  updated_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Cart', cartSchema);