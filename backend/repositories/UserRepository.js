// User Repository
// Handles all database operations for user data
const User = require('../models/UserModel')

class UserRepository {
  // Find all users (paginated)
  async findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sử dụng Promise.all để chạy song song 2 truy vấn, giúp tăng tốc độ
    const [users, total] = await Promise.all([
      User.find({}, { password: 0 }) // Loại bỏ mật khẩu
          .skip(skip)
          .limit(limitNum)
          .sort({ createdAt: -1 }) 
          .lean(),
      User.countDocuments() 
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }


  // Find user by email
  async findByEmail(email) {
    return await User.findOne({ email })
  }

  // Find user by ID
  async findById(id) {
    return await User.findById(id, { password: 0 }).lean()
  }

  // Create a new user
  async create(userData) {
    const user = new User(userData)
    return await user.save()
  }

  // Update user
  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true, projection: { password: 0 } })
  }

  // Delete user
  async delete(id) {
    return await User.findByIdAndDelete(id)
  }
}

module.exports = new UserRepository()
