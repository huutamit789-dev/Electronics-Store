import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "../features/auth/AuthPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;