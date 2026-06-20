const FooterRepository = require('../repositories/FooterRepository');

class FooterService {
  // Get active footer (Public)
  async getActiveFooter() {
    return await FooterRepository.findActive();
  }

  // Get footer by ID (Public)
  async getFooterById(id) {
    if (!id) throw new Error('Footer ID is required');

    const footer = await FooterRepository.findById(id);
    if (!footer) throw new Error('Footer not found');
    
    return footer;
  }

  // Get all footers (Admin only)
  async getAllFooters() {
    return await FooterRepository.findAll();
  }

  // Create a new footer (Admin only)
  async createFooter(user, footerData) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');

    const { company_name } = footerData;

    if (!company_name) throw new Error('company_name is required');

    return await FooterRepository.create(footerData);
  }

  // Update footer (Admin only)
  async updateFooter(user, id, footerData) {
    if (!user || user.role !== 'admin') {
      throw new Error('Bạn không có quyền thực hiện tác vụ này');
    }
    if (!id) throw new Error('Footer ID is required');
    if (!footerData) throw new Error('Footer data is required');
    
    const updatedFooter = await FooterRepository.update(id, footerData);

    if (!updatedFooter) {
      throw new Error('Footer not found or update failed');
    }

    return updatedFooter;
  }

  // Delete footer (Admin only)
  async deleteFooter(user, id) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
    if (!id) throw new Error('Footer ID is required');

    const deleted = await FooterRepository.delete(id);
    if (!deleted) throw new Error('Footer not found');
    
    return deleted;
  }
}

module.exports = new FooterService();
