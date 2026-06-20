// Banner Repository
// Handles all database operations for banner data
const Banner = require('../models/BannerModel')

class BannerRepository {
  // Find all banners
  async findAll() {
    return await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
  }

  // Find banner by ID
  async findById(id) {
    return await Banner.findById(id).lean();
  }

  // Find active banners by position
  async findActiveByPosition(position) {
    return await Banner.find({ 
      position: position, 
      is_active: true 
    }).sort({ order: 1, createdAt: -1 }).lean();
  }

  // Create a new banner
  async create(bannerData) {
    const banner = new Banner(bannerData);
    return await banner.save();
  }

  // Update banner
  async update(id, bannerData) {
    return await Banner.findByIdAndUpdate(id, bannerData, { new: true });
  }

  // Delete banner
  async delete(id) {
    return await Banner.findByIdAndDelete(id);
  }
}

module.exports = new BannerRepository();
