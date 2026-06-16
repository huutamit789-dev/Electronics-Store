const UserRepository = require('../repositories/UserRepository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

class UserService {

  _throwError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }

async getAllUsers(page = 1, limit = 10) {
    try {
      return await UserRepository.findAll(page, limit);
    } catch (error) {
      console.error('Service Error [getAllUsers]:', error);
      throw new Error('Lỗi truy xuất danh sách người dùng');
    }
  }

  async createUser(userData) {
    const { username, email, password, phonenumber } = userData;

    // Validation
    if (!username || !email || !password || !phonenumber) {
      this._throwError('Thông tin đăng ký không đầy đủ', 400);
    }

    try {
      const existing = await UserRepository.findByEmail(email);
      if (existing) this._throwError('Email đã được sử dụng', 409);

      const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS || 10);

      const newUser = await UserRepository.create({
        username, email, password: hashedPassword, phonenumber
      });

      return {
        insertedId: newUser._id,
        user: { username: newUser.username, email: newUser.email, phonenumber: newUser.phonenumber }
      };
    } catch (error) {
      console.error('Service Error [createUser]:', error);
      if (error.status === 409) throw error;
      throw new Error('Đã có lỗi xảy ra khi tạo tài khoản');
    }
  }

  async verifyPassword(email, password) {
    if (!email || !password) this._throwError('email và password là bắt buộc', 400);

    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) this._throwError('Người dùng không tồn tại', 404);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) this._throwError('Mật khẩu không chính xác', 401);

      const payload = { id: user._id, email: user.email };
      const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

      return {
        token,
        user: { id: user._id, username: user.username, email: user.email, phonenumber: user.phonenumber }
      };
    } catch (error) {
      console.error(`Service Error [verifyPassword - ${email}]:`, error);
      if ([404, 401].includes(error.status)) throw error;
      throw new Error('Lỗi trong quá trình xác thực');
    }
  }

  async getUserById(id) {
    if (!id) this._throwError('ID người dùng là bắt buộc', 400);
    
    try {
      const user = await UserRepository.findById(id);
      if (!user) this._throwError('Người dùng không tồn tại', 404);
      return user;
    } catch (error) {
      console.error(`Service Error [getUserById - ${id}]:`, error);
      if (error.status === 404) throw error;
      throw new Error('Lỗi lấy thông tin người dùng');
    }
  }
}

module.exports = new UserService()