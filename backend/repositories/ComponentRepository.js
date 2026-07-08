// Component Repository
// Handles all database operations for component data
const Component = require('../models/ComponentModel')

class ComponentRepository {
  // Find all components
  async findAll() {
    return await Component.find().sort({ order: 1, createdAt: -1 }).lean();
  }

  // Find component by ID
  async findById(id) {
    return await Component.findById(id).lean();
  }

  // Find components by type
  async findByType(type) {
    return await Component.find({ type }).sort({ order: 1, createdAt: -1 }).lean();
  }

  // Find components by position
  async findByPosition(position) {
    return await Component.find({ position }).sort({ order: 1, createdAt: -1 }).lean();
  }

  // Find active components by position
  async findActiveByPosition(position) {
    return await Component.find({ 
      position: position, 
      is_active: true 
    }).sort({ order: 1, createdAt: -1 }).lean();
  }

  // Find all active components
  async findActive() {
    return await Component.find({ is_active: true }).sort({ order: 1, createdAt: -1 }).lean();
  }

  // Create a new component
  async create(componentData) {
    const component = new Component(componentData);
    return await component.save();
  }

  // Update component
  async update(id, componentData) {
    return await Component.findByIdAndUpdate(id, componentData, { new: true });
  }

  // Delete component
  async delete(id) {
    return await Component.findByIdAndDelete(id);
  }
}

module.exports = new ComponentRepository();
