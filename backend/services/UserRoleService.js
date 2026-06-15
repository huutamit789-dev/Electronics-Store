const UserRoleRepository = require('../repositories/UserRoleRepository');

const UserRoleService = {
  createUserRole: async (userId) => {
    return await UserRoleRepository.create({ user_id: userId, status: 'attempt' });
  },

  updateStatus: async (userId, newStatus) => {
    return await UserRoleRepository.updateStatus(userId, newStatus);
  },

  getUserRole: async (userId) => {
    return await UserRoleRepository.findByUserId(userId);
  }
};

module.exports = UserRoleService;