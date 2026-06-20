const BannerRepository = require('../repositories/BannerRepository');

class BannerService {
  // Lấy tất cả banners (Public)
  async getAllBanners() {
    return await BannerRepository.findAll();
  }

  // Lấy banner theo ID (Public)
  async getBannerById(id) {
    if (!id) throw new Error('Banner ID is required');

    const banner = await BannerRepository.findById(id);
    if (!banner) throw new Error('Banner not found');
    
    return banner;
  }

  // Lấy banners đang active theo vị trí (Public)
  async getActiveBannersByPosition(position) {
    if (!position) throw new Error('Position is required');

    return await BannerRepository.findActiveByPosition(position);
  }

  // Tạo banner mới (Admin only)
  async createBanner(user, bannerData) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');

    const { title, image_url, position } = bannerData;

    if (!title || !image_url || !position) throw new Error('title, image_url, and position are required');

    return await BannerRepository.create(bannerData);
  }

  // Cập nhật banner (Admin only)
  async updateBanner(user, id, bannerData) {
    if (!user || user.role !== 'admin') {
      throw new Error('Bạn không có quyền thực hiện tác vụ này');
    }
    if (!id) throw new Error('Banner ID is required');
    if (!bannerData) throw new Error('Banner data is required');
    
    const updatedBanner = await BannerRepository.update(id, bannerData);

    if (!updatedBanner) {
      throw new Error('Banner not found or update failed');
    }

    return updatedBanner;
  }

  // Xóa banner (Admin only)
  async deleteBanner(user, id) {
    if (!user || user.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
    if (!id) throw new Error('Banner ID is required');

    const deleted = await BannerRepository.delete(id);
    if (!deleted) throw new Error('Banner not found');
    
    return deleted;
  }
}

module.exports = new BannerService();
