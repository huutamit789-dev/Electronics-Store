const UserRoleRepository = require('../repositories/UserRoleRepository');

const UserRoleService = {
  createUserRole: async (userId) => {
    if (!userId) throw new Error('User ID là bắt buộc');

    return await UserRoleRepository.create({ user_id: userId, status: 'attempt' });
  },

  updateStatus: async (userId, newStatus) => {
    const VALID_STATUSES = ['attempt', 'approved', 'admin'];
    
    if (!userId || !newStatus) throw new Error('Thiếu dữ liệu cập nhật');
    if (!VALID_STATUSES.includes(newStatus)) throw new Error('Trạng thái không hợp lệ');

    const updated = await UserRoleRepository.updateStatus(userId, newStatus);
    if (!updated) throw new Error('Không tìm thấy UserRole để cập nhật');
    
    return updated;
  },

  getUserRole: async (userId) => {
    if (!userId) throw new Error('User ID là bắt buộc');

    const role = await UserRoleRepository.findByUserId(userId);
    if (!role) throw new Error('Không tìm thấy quyền người dùng');
    
    return role;
  }
};

module.exports = UserRoleService;