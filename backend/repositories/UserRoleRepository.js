const UserRole = require('../models/UserRoleModel');

class UserRoleRepository {
  async create(data) {
    return await UserRole.create(data);
  }

  async findByUserId(userId) {
    return await UserRole.findOne({ user_id: userId });
  }

  async updateStatus(userId, status) {
    return await UserRole.findOneAndUpdate(
      { user_id: userId },
      { status: status },
      { new: true }
    );
  }
}

module.exports = new UserRoleRepository();