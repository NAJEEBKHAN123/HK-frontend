// components/AdminSidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="w-64 min-h-screen bg-cyan-700 text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard" className="hover:text-cyan-200">Dashboard</Link>
        <Link to="/admin/appointment" className="hover:text-cyan-200">Book Appointment</Link>
        <Link to="/admin/orders" className="hover:text-cyan-200">Order</Link>
        <Link to="/admin/contacts" className="hover:text-cyan-200">View Contacts</Link>
        <button
          onClick={handleLogout}
          className="mt-8 text-left hover:text-red-300"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
