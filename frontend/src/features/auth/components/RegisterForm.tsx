
import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    setError('');
    console.log('Dữ liệu gửi đi:', formData);
    alert('Đăng ký thành công!');
  };

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: all 0.3s;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(118, 75, 162, 0.3);
        }
        .form-control:focus {
          border-color: #764ba2;
          box-shadow: 0 0 0 0.25rem rgba(118, 75, 162, 0.25);
        }
      `}</style>

      <div className="container-fluid py-5 min-vh-100 d-flex align-items-center" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 glass-card">
                <h3 className="text-center fw-bold mb-4" style={{ color: '#333' }}>Tạo tài khoản mới</h3>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Tên đăng nhập</label>
                    <input type="text" name="username" className="form-control form-control-lg" onChange={handleChange} required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <input type="email" name="email" className="form-control form-control-lg" onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">Số điện thoại</label>
                    <input type="tel" name="phone" className="form-control form-control-lg" onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">Mật khẩu</label>
                    <input type="password" name="password" className="form-control form-control-lg" onChange={handleChange} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted">Xác nhận mật khẩu</label>
                    <input type="password" name="confirmPassword" className="form-control form-control-lg" onChange={handleChange} required />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill btn-gradient">
                    Đăng ký ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;