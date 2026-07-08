const mongoose = require('mongoose');

const componentProductSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  product_name: { type: String, required: true },
  product_image: { type: String, required: true },
  original_price: { type: Number, required: true },
  discount_price: { type: Number, required: true },
  sold_percentage: { type: Number, default: 0, min: 0, max: 100 },
  discount_percentage: { type: Number, default: 0, min: 0, max: 100 }
});

const componentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['flash_sale', 'best_selling', 'new_arrival', 'custom'],
    required: true 
  },
  title: { type: String, required: true },
  description: String,
  background_color: { type: String, default: '#dc3545' },
  text_color: { type: String, default: '#ffffff' },
  button_color: { type: String, default: '#ffffff' },
  button_text_color: { type: String, default: '#dc3545' },
  show_countdown: { type: Boolean, default: true },
  countdown_end: Date,
  products: [componentProductSchema],
  position: { 
    type: String, 
    enum: ['home_top', 'home_middle', 'home_bottom'],
    required: true 
  },
  is_active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Component', componentSchema);
