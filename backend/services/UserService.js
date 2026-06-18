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

    // Validate required fields: username, password, phonenumber are required. Email is optional.
    if (!username || !password || !phonenumber) {
      throw new Error('Registration information is incomplete: username, password, and phonenumber are required.');
    }

    // Check if the username already exists
    const existingByUsername = await UserRepository.findByUsername(username);
    if (existingByUsername) {
      throw new Error('Username is already in use.');
    }

    // If email is provided, check if it's already in use
    if (email) {
      const existingByEmail = await UserRepository.findByEmail(email);
      if (existingByEmail) {
        throw new Error('Email is already in use.');
      }
    }

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS || 10);

    // Start a Mongoose session for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Create the user document
      const newUser = await UserRepository.create({
        username, email, password: hashedPassword, phonenumber
      }, { session });

      // 2. Initialize the default role for the new user
      await UserRoleRepository.create({
        user_id: newUser._id,
        role: 'user',
        status: 'approved'
      }, { session });

      // Commit the transaction if both operations succeed
      await session.commitTransaction();
      
      return {
        insertedId: newUser._id,
        user: { username: newUser.username, email: newUser.email } // email might be null/undefined here
      };
    } catch (error) {
      // Rollback changes if any operation fails
      console.error("Transaction error:", error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
  async verifyPassword(identifier, password) { // Changed email to identifier
    let user = await UserRepository.findByUsername(identifier);
    
    // If not found by username, try finding by email
    if (!user) {
      user = await UserRepository.findByEmail(identifier);
    }

    // Verify user existence and password validity
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid authentication credentials');
    }

    // Sign the JWT
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Changed payload to use username
      config.JWT_SECRET, 
      { expiresIn: config.JWT_EXPIRES_IN }
    );
    
    return { 
      token, 
      user: { id: user._id, username: user.username, email: user.email } // Include email if present
    };
  }
}

module.exports = new UserService();