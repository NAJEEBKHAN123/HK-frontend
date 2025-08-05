import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PartnerLayout from '../../components/partnerDashboard/PartnerLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL; // Changed port to 5000


const PartnerProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${API_BASE_URL}/api/partner-auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          timeout: 5000
        });

        if (isMounted) {
          setAuthStatus(response.data.success ? 'authenticated' : 'unauthenticated');
        }
      } catch (error) {
        if (isMounted && error.name !== 'AbortError') {
          console.error('Verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('partnerData');
          setAuthStatus('unauthenticated');
        }
      }
    };

    // Immediate check for token presence
    if (!localStorage.getItem('token')) {
      setAuthStatus('unauthenticated');
      return;
    }

    verifyAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.pathname]);

  switch (authStatus) {
    case 'authenticated':
      return (
        <PartnerLayout>
          <Outlet />
        </PartnerLayout>
      );
    case 'unauthenticated':
      return <Navigate to="/partner/login" state={{ from: location }} replace />;
    default:
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
          <span className="ml-4">Loading partner dashboard...</span>
        </div>
      );
  }
};

export default PartnerProtectedRoute;