import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;