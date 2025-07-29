// src/components/partnerDashboard/PartnerLayout.jsx
import React from 'react';
import PartnerSidebar from '../../components/partnerDashboard/PartnerSidebar';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PartnerLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if partner is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/partner/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <PartnerSidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <footer className="bg-cyan-800 text-white text-center py-4 mt-auto">
        © 2025 Ouvrir Société Hong Kong — All Rights Reserved
      </footer>
    </div>
  );
};

export default PartnerLayout;