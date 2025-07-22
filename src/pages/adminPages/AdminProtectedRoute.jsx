import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../../service/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await api.get('/api/admin/verify', {
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
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminId');
          setAuthStatus('unauthenticated');
        }
      }
    };

    // Immediate check for token presence
    if (!localStorage.getItem('adminToken')) {
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
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      );
    case 'unauthenticated':
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    default:
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
          <span className="ml-4">Loading admin panel...</span>
        </div>
      );
  }
};

export default AdminProtectedRoute;