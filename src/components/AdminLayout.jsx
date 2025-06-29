// layouts/AdminLayout.jsx
import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
};

export default AdminLayout;
