const ComponentRepository = require('../repositories/ComponentRepository');

class ComponentService {
  // Lấy tất cả components (Public)
  async getAllComponents() {
    return await ComponentRepository.findAll();
  }

  // Lấy component theo ID (Public)
  async getComponentById(id) {
    if (!id) throw new Error('Component ID is required');

    const component = await ComponentRepository.findById(id);
    if (!component) throw new Error('Component not found');
    
    return component;
  }

  // Lấy components theo type (Public)
  async getComponentsByType(type) {
    if (!type) throw new Error('Type is required');

    return await ComponentRepository.findByType(type);
  }

  // Lấy components theo position (Public)
  async getComponentsByPosition(position) {
    if (!position) throw new Error('Position is required');

    return await ComponentRepository.findByPosition(position);
  }

  // Lấy components đang active (Public)
  async getActiveComponents() {
    return await ComponentRepository.findActive();
  }

  // Lấy components đang active theo position (Public)
  async getActiveComponentsByPosition(position) {
    if (!position) throw new Error('Position is required');

    return await ComponentRepository.findActiveByPosition(position);
  }

  // Tạo component mới (Admin only)
  async createComponent(user, componentData) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');

    const { type, title, position } = componentData;

    if (!type || !title || !position) throw new Error('type, title, and position are required');

    return await ComponentRepository.create(componentData);
  }

  // Cập nhật component (Admin only)
  async updateComponent(user, id, componentData) {
    if (!user || user.role !== 'admin') {
      throw new Error('Bạn không có quyền thực hiện tác vụ này');
    }
    if (!id) throw new Error('Component ID is required');
    if (!componentData) throw new Error('Component data is required');
    
    const updatedComponent = await ComponentRepository.update(id, componentData);

    if (!updatedComponent) {
      throw new Error('Component not found or update failed');
    }

    return updatedComponent;
  }

  // Xóa component (Admin only)
  async deleteComponent(user, id) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
    if (!id) throw new Error('Component ID is required');

    const deleted = await ComponentRepository.delete(id);
    if (!deleted) throw new Error('Component not found');
    
    return deleted;
  }
}

module.exports = new ComponentService();
