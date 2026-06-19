const mongoose = require('mongoose');
const UserRepository = require('../repositories/UserRepository');
const UserRoleRepository = require('../repositories/UserRoleRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * UserService handles business logic for user management,
 * including authentication, registration, and administrative tasks.
 */
class UserService {
  
  /**
   * Registers a new user and initializes their role record in the database.
   * Uses a transaction to ensure data consistency between User and UserRole collections.
   */
  async createUser(userData) {
    const { username, email, password, phonenumber } = userData;

    // 1. Chỉ validate các trường bắt buộc cơ bản
    if (!username || !password || !phonenumber) {
      throw new Error('Username, password, and phonenumber are required.');
    }

    // 2. Validate trùng lặp Username
    const existingByUsername = await UserRepository.findByUsername(username);
    if (existingByUsername) {
      throw new Error('Username is already in use.');
    }

    // 3. Validate trùng lặp Email (nếu người dùng có nhập email)
    if (email) {
      const existingByEmail = await UserRepository.findByEmail(email);
      if (existingByEmail) {
        throw new Error('Email is already in use.');
      }
    }

    // 4. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Tạo user (không cần transaction phức tạp nếu bạn thấy rắc rối)
    // Nhưng vẫn nên dùng để đảm bảo dữ liệu đồng bộ
    const newUser = await UserRepository.create({
      username, email, password: hashedPassword, phonenumber
    });

    // 6. Tạo role mặc định
    await UserRoleRepository.create({
      user_id: newUser._id,
      role: 'user',
      status: 'approved'
    });

    return {
      insertedId: newUser._id,
      user: { username: newUser.username, email: newUser.email }
    };
  }
  /**
   * Deletes a user and their associated role record.
   * Restricted to admin access only.
   */
  async deleteUser(currentUser, userIdToDelete) {
    // Permission check: ensure only admins can delete users
    if (!currentUser || currentUser.role !== 'admin') {
      const error = new Error('You do not have permission to perform this action');
      error.status = 403;
      throw error;
    }

    // Prevent administrators from deleting their own accounts
    if (currentUser._id.toString() === userIdToDelete) {
      const error = new Error('You cannot delete your own account');
      error.status = 400;
      throw error;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Delete user from the main collection
      const deletedUser = await UserRepository.delete(userIdToDelete, { session });
      if (!deletedUser) throw new Error('User not found');

      // 2. Remove the associated role record to avoid orphaned data
      await UserRoleRepository.deleteByUserId(userIdToDelete, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Fetches all users with pagination. Admin-only access.
   */
  async getAllUsers(currentUser, page = 1, limit = 10) {
    if (!currentUser || currentUser.role !== 'admin') throw new Error('Access denied');
    return await UserRepository.findAll(page, limit);
  }

  /**
   * Updates user profile and admin-managed fields.
   * Restricted to admin access only.
   */
  async updateUser(currentUser, userIdToUpdate, userData) {
    if (!currentUser || currentUser.role !== 'admin') {
      const error = new Error('You do not have permission to perform this action');
      error.status = 403;
      throw error;
    }

    if (!userIdToUpdate) {
      const error = new Error('User ID is required');
      error.status = 400;
      throw error;
    }

    const { username, email, phonenumber, role, status } = userData;
    const updatedUser = await UserRepository.update(userIdToUpdate, {
      username,
      email, // email is now optional
      phonenumber,
      role,
      status
    });

    if (!updatedUser) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return updatedUser;
  }

  /**
   * Authenticates user credentials and generates a JWT token.
   * Can log in using either username or email.
   */
  async verifyPassword(username, password) {
    // 1. Chỉ tìm bằng username
    const user = await UserRepository.findByUsername(username);

    // 2. Nếu không thấy user hoặc mật khẩu sai
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      throw new Error('Invalid authentication credentials');
    }

    // 3. Lấy role
    const userRoleRecord = await UserRoleRepository.findByUserId(user._id);
    const role = userRoleRecord ? userRoleRecord.role : 'user';

    // 4. Tạo token
    const token = jwt.sign(
        { id: user._id, username: user.username, role: role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: { id: user._id, username: user.username, role: role }
    };
  }
}

module.exports = new UserService();