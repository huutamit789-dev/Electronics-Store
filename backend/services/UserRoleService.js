const UserRoleRepository = require('../repositories/UserRoleRepository');

const UserRoleService = {
  // Hàm trợ giúp để ném lỗi nghiệp vụ
  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  },

  createUserRole: async (userId) => {
    if (!userId) UserRoleService._throwError('User ID là bắt buộc', 400);

    try {
      return await UserRoleRepository.create({ user_id: userId, status: 'attempt' });
    } catch (error) {
      console.error('Service Error [createUserRole]:', error);
      throw new Error('Không thể khởi tạo quyền cho người dùng');
    }
  },

  updateStatus: async (userId, newStatus) => {
    const VALID_STATUSES = ['attempt', 'approved', 'admin'];
    
    if (!userId || !newStatus) UserRoleService._throwError('Thiếu dữ liệu cập nhật', 400);
    if (!VALID_STATUSES.includes(newStatus)) UserRoleService._throwError('Trạng thái không hợp lệ', 400);

    try {
      const updated = await UserRoleRepository.updateStatus(userId, newStatus);
      if (!updated) UserRoleService._throwError('Không tìm thấy UserRole để cập nhật', 404);
      return updated;
    } catch (error) {
      console.error(`Service Error [updateStatus - ${userId}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi cập nhật trạng thái người dùng');
    }
  },

  getUserRole: async (userId) => {
    if (!userId) UserRoleService._throwError('User ID là bắt buộc', 400);

    try {
      const role = await UserRoleRepository.findByUserId(userId);
      if (!role) UserRoleService._throwError('Không tìm thấy quyền người dùng', 404);
      return role;
    } catch (error) {
      console.error(`Service Error [getUserRole - ${userId}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi lấy thông tin quyền');
    }
  }
};

module.exports = UserRoleService;