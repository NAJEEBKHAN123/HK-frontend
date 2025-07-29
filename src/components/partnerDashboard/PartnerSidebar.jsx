import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiCalendar,
  FiShoppingCart,
  FiUsers,
  FiMail,
  FiLogOut,
} from "react-icons/fi";

const PartnerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/partner/login");
  };

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-200 ${
      location.pathname.includes(path)
        ? "bg-cyan-600 text-white"
        : "hover:text-cyan-200"
    }`;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-[65px] left-4 z-50 p-2 bg-gray-100 text-black rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static pt-32 lg:pt-8 sm:pt-8 inset-y-0 left-0 w-64 min-h-screen 
        bg-cyan-700 text-white p-6 space-y-4 transition-transform duration-300 ease-in-out z-40`}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-white text-cyan-700 p-1 rounded-full">
            <FiHome />
          </span>
          Partner Panel
        </h2>

        <nav className="flex flex-col gap-2">
          <Link
            to="/partner/dashboard"
            className={navLinkClass("/partner/dashboard")}
            onClick={() => setIsOpen(false)}
          >
            <FiHome /> Home
          </Link>
      
          
         
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-3 text-left hover:text-red-300 transition-all"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default PartnerSidebar;
