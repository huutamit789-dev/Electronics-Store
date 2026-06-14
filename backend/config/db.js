// Database connection helper for the backend
// This module centralizes MongoDB Atlas connection details and exposes a Mongoose connect function.
const dns = require('dns')
const mongoose = require('mongoose')
require('dotenv').config()

// Use public DNS resolvers to avoid local DNS issues with MongoDB Atlas SRV records.
// This is helpful when the local network/resolver blocks SRV lookups.
dns.setServers(['1.1.1.1', '8.8.8.8'])

const uri = process.env.DB_STRING
const dbName = process.env.DB_NAME || 'ElectronicsDB'

async function connectDB() {
  if (!uri) {
    throw new Error('DB_STRING is not defined in .env')
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { dbName })
    console.log(`✅ Connected to MongoDB database: ${dbName}`)
  }

  return mongoose.connection
}

module.exports = { connectDB }
