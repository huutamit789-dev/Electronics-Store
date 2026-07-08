const components = require('./components');
const paths = require('./paths');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'ElectricStore Backend API',
    version: '1.0.0',
    description: 'API documentation for the ElectricStore e-commerce backend.'
  },
  servers: [
    { url: 'http://localhost:8091', description: 'Local development server' },
    { url: 'https://electronics-store-up.onrender.com', description: 'Production server' }
  ],
  components: components,
  paths: paths
};

module.exports = swaggerDocument;