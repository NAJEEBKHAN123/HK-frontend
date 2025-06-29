import React from "react";
import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-cyan-800 mb-4">
        Welcome, {admin?.name || "Admin"}!
      </h1>
      <p>This is your dashboard.</p>
    </AdminLayout>
  );
};

export default AdminDashboard;
