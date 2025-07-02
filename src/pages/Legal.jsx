import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HiShieldCheck,
  HiScale,
  HiDocumentText,
  HiAdjustmentsHorizontal,
  HiOutlineGlobeAlt,
  HiOutlinePuzzlePiece,
} from "react-icons/hi2";

const legalItems = [
  { icon: <HiShieldCheck size={42} />, label: "Privacy OSHK", route: "privacy" },
  { icon: <HiScale size={42} />, label: "Legal Notices", route: "notices" },
  { icon: <HiDocumentText size={42} />, label: "General Conditions", route: "conditions" },
  { icon: <HiOutlinePuzzlePiece size={42} />, label: "Cookies", route: "cookies" },
  { icon: <HiOutlineGlobeAlt size={42} className="text-purple-600" />, label: "Accessibility", route: "accessibility" },
  { icon: <HiAdjustmentsHorizontal size={42} />, label: "Your Choices for Privacy", route: "choices" },
];


const Legal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDocumentView = location.pathname !== "/legal";

  // Dynamically get the title based on the route
  const currentLabel =
    legalItems.find(item => location.pathname.includes(item.route))?.label || "Legal Information";

  return (
    <div className="lg:px-[74px]  max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-12 pl-8 pt-12 uppercase" >{currentLabel}</h2>

      {/* Legal Items Grid */}
      <div className="grid px-2 grid-cols-2 md:px-6 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-10 text-center">
        {legalItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.route)}
            className={`cursor-pointer   flex flex-col items-center space-y-2 transition-all ${
              location.pathname.includes(item.route)
                ? "text-cyan-700"
                : "hover:text-gray-700"
            }`}
          >
            {item.icon}
            <div className="font-semibold text-sm leading-tight">
              {item.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Outlet for Selected Document */}
      <div
        className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow transition-all ${
          isDocumentView ? "opacity-100 max-h-full" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <Outlet />
      </div>

      {/* Back Button */}
      {isDocumentView && (
        <div className="mt-6 text-center pb-4">
          <button
            onClick={() => navigate("/legal")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ← Back to All Legal Documents
          </button>
        </div>
      )}
    </div>
  );
};

export default Legal;
