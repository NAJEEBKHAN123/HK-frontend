// components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin"); // Or use context
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;
