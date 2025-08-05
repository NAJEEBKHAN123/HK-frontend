import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PartnerStats from '../../pages/PartnerPages/PartnerStats';
import ReferredClientsTable from '../../pages/PartnerPages/ReferredClientsTable';

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL; // Changed port to 5000


const PartnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/partner-auth/dashboard`);
        setDashboardData(response.data.data);
        console.log('partner details in partner page',response.data.data)

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch dashboard data');
        if (err.response?.status === 401) {
          navigate('/partner/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl pt-10 font-bold text-gray-900">Partner Dashboard</h1>
      
      {/* Partner Stats */}
      <PartnerStats partner={dashboardData.partner} />
      
      {/* Referred Clients */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Referred Clients</h2>
        <ReferredClientsTable clients={dashboardData.clients} />
      </div>
    </div>
  );
};

export default PartnerDashboard;