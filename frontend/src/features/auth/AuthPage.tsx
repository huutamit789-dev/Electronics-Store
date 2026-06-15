import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg overflow-hidden"
        style={{
          width: "900px",
          minHeight: "550px",
        }}
      >
        <div className="row g-0 h-100">
          {/* Bên trái */}
          <div
            className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5"
            style={{
              background:
                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <h1 className="fw-bold mb-3">
              Electric Store
            </h1>

            <p className="text-center">
              Mua sắm thiết bị điện tử chất lượng cao.
              Đăng nhập để trải nghiệm dịch vụ tốt nhất.
            </p>
          </div>

          {/* Bên phải */}
          <div className="col-md-7 p-5 d-flex flex-column justify-content-center">

            <h2 className="fw-bold text-center mb-4">
              {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </h2>

            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm />
            )}

            <div className="text-center mt-3">
              {isLogin ? (
                <>
                  Chưa có tài khoản?{" "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => setIsLogin(false)}
                  >
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => setIsLogin(true)}
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;