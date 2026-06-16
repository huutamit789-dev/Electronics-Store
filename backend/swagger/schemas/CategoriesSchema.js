module.exports = {
  categories: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Laptops' },
      description: { type: 'string', example: 'Computer and laptop products' }
    }
  },
};