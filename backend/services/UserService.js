const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
 const debug = require('debug')('app:service:user');

class UserService {
async getAllUsers(currentUser, page = 1, limit = 10) {
  debug('Checking permissions for user:', currentUser); 
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Bạn không có quyền');
  }
  return await UserRepository.findAll(page, limit);
}
  async createUser(userData) {
    const { username, email, password, phonenumber } = userData;

    // Validation
    if (!username || !email || !password || !phonenumber) {
      throw new Error('Thông tin đăng ký không đầy đủ');
    }

    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new Error('Email đã được sử dụng');

    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS || 10);

    const newUser = await UserRepository.create({
      username, email, password: hashedPassword, phonenumber
    });

    return {
      insertedId: newUser._id,
      user: { username: newUser.username, email: newUser.email, phonenumber: newUser.phonenumber }
    };
  }

  async verifyPassword(email, password) {
    if (!email || !password) throw new Error('email và password là bắt buộc');

    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không chính xác');

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    return {
      token,
      user: { id: user._id, username: user.username, email: user.email, phonenumber: user.phonenumber }
    };
  }

  async getUserById(id) {
    if (!id) throw new Error('ID người dùng là bắt buộc');
    
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Người dùng không tồn tại');
    
    return user;
  }


  // Cập nhật user (Admin only)
  async updateUser(currentUser, userId, userData) {
    if (!currentUser || currentUser.role !== 'admin') throw new Error('Bạn không có quyền thực hiện tác vụ này');
    if (!userId) throw new Error('User ID is required');

    const updated = await UserRepository.update(userId, userData);
    if (!updated) throw new Error('User not found');
    
    return updated;
  }

  async deleteUser(currentUser, userIdToDelete) {
    // 1. Kiểm tra quyền Admin
    if (!currentUser || currentUser.role !== 'admin') {
      const error = new Error('Bạn không có quyền thực hiện hành động này');
      error.status = 403;
      throw error;
    }

    // 2. Không cho phép Admin tự xóa chính mình (tùy chọn)
    if (currentUser._id.toString() === userIdToDelete) {
      const error = new Error('Bạn không thể tự xóa tài khoản của chính mình');
      error.status = 400;
      throw error;
    }

    // 3. Thực hiện xóa
    const deletedUser = await UserRepository.delete(userIdToDelete);
    if (!deletedUser) {
      const error = new Error('Người dùng không tồn tại');
      error.status = 404;
      throw error;
    }
  }
}

module.exports = new UserService();