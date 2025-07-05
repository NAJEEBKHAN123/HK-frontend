import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-[65px] left-4 z-50 p-2 bg-gray-100  text-black rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} className="" />}
      </button>

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static pt-32 lg:pt-8 sm:pt-8 inset-y-0 left-0 w-64 min-h-screen 
        bg-cyan-700 text-white p-6 space-y-4 transition-transform duration-300 
        ease-in-out z-40`}>
        
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/admin/dashboard" className="hover:text-cyan-200" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link to="/admin/appointment" className="hover:text-cyan-200" onClick={() => setIsOpen(false)}>
            Book Appointment
          </Link>
          <Link to="/admin/orders" className="hover:text-cyan-200" onClick={() => setIsOpen(false)}>
            Order
          </Link>
          <Link to="/admin/contacts" className="hover:text-cyan-200" onClick={() => setIsOpen(false)}>
            View Contacts
          </Link>
          <button
            onClick={handleLogout}
            className="mt-8 text-left hover:text-red-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;