import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen mt-16 md:mt-0">
        {children}
      </main>
      <Outlet /> 
    </div>
  );
};

export default AdminLayout;