const UserRoleService = require('../services/UserRoleService');

const userRoleController = {
  // API để Admin duyệt hoặc nâng cấp quyền
  updateUserStatus: async (req, res) => {
    try {
      const { userId, status } = req.body; // status: 'approved', 'admin', v.v.
      
      const updatedUserRole = await UserRoleService.updateStatus(userId, status);
      
      if (!updatedUserRole) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin role của user' });
      }
      
      res.status(200).json({ message: 'Cập nhật trạng thái thành công', data: updatedUserRole });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy chi tiết status/role
  getStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const userRole = await UserRoleService.getUserRole(userId);
      res.status(200).json(userRole);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userRoleController;