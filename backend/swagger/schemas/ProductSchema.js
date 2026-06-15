module.exports = {
  Category: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Laptops' },
      description: { type: 'string', example: 'Computer and laptop products' }
    }
  },
  Product: {
    type: 'object',
    required: ['name', 'price', 'category_id'],
    properties: {
      name: { type: 'string', example: 'Gaming Laptop' },
      description: { type: 'string', example: 'High-performance laptop for gaming' },
      price: { type: 'number', example: 1499.99 },
      stock_quantity: { type: 'integer', example: 20 },
      image_url: { type: 'string', example: 'https://example.com/image.png' },
      category_id: { type: 'string', example: '64adf1ab1234567890abcdef' }
    }
  }
};