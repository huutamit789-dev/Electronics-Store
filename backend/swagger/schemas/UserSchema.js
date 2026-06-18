module.exports = {
  User: {
    type: 'object',
    required: ['username', 'email', 'password', 'phonenumber'],
    properties: {
      username: { type: 'string', example: 'john_doe' },
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      password: { type: 'string', example: 'strongPassword123' },
      phonenumber: { type: 'string', example: '0123456789' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      password: { type: 'string', example: 'strongPassword123' }
    }
  },
  LoginResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '64adf1ab1234567890abcdef' },
          username: { type: 'string', example: 'john_doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          phonenumber: { type: 'string', example: '0123456789' }
        }
      }
    }
  }
};