import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6  ">
          <Outlet />
        </main>
      </div>
      <footer className="bg-cyan-800 text-white text-center py-4 mt-auto">
        © 2025 Ouvrir Société Hong Kong — All Rights Reserved
      </footer>
    </div>
  );
};

export default AdminLayout;
