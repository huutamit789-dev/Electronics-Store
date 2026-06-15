import React, { useState } from "react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Đăng nhập:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="mb-3">
        <label className="form-label">
          Tên đăng nhập
        </label>
        <input
          type="text"
          name="username"
          className="form-control form-control-lg"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">
          Mật khẩu
        </label>
        <input
          type="password"
          name="password"
          className="form-control form-control-lg"
          onChange={handleChange}
          required
        />
      </div>

      <button 
        className="btn btn-primary w-100 rounded-pill"
      >
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;