// Footer Repository
// Handles all database operations for footer data
const Footer = require('../models/FooterModel')

class FooterRepository {
  // Find all footers
  async findAll() {
    return await Footer.find().sort({ createdAt: -1 }).lean();
  }

  // Find footer by ID
  async findById(id) {
    return await Footer.findById(id).lean();
  }

  // Find active footer
  async findActive() {
    return await Footer.findOne({ is_active: true }).lean();
  }

  // Create a new footer
  async create(footerData) {
    const footer = new Footer(footerData);
    return await footer.save();
  }

  // Update footer
  async update(id, footerData) {
    return await Footer.findByIdAndUpdate(id, footerData, { new: true });
  }

  // Delete footer
  async delete(id) {
    return await Footer.findByIdAndDelete(id);
  }
}

module.exports = new FooterRepository();
