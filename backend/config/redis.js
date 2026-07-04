const Redis = require('ioredis');
require('dotenv').config();

// Sử dụng REDIS_URL từ biến môi trường, hoặc localhost mặc định
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redis.on('connect', () => {
    console.log('Redis connected successfully!');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redis;
