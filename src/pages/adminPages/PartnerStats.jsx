import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const PartnerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('/api/partner-auth/admin/partner-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  const chartData = {
    labels: ['Active Partners', 'Inactive Partners'],
    datasets: [
      {
        label: 'Partners',
        data: [stats?.activePartners || 0, stats?.inactivePartners || 0],
        backgroundColor: ['#10B981', '#EF4444'],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Partner Program Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Partners" 
          value={stats?.totalPartners || 0} 
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Active Partners" 
          value={stats?.activePartners || 0} 
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Total Commission" 
          value={`$${(stats?.totalCommission / 100).toFixed(2) || '0.00'}`} 
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          title="Commission Paid" 
          value={`$${(stats?.totalPaid / 100).toFixed(2) || '0.00'}`} 
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard 
          title="Pending Payout" 
          value={`$${(stats?.pendingPayout / 100).toFixed(2) || '0.00'}`} 
          color="bg-orange-100 text-orange-600"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats?.conversionRate?.toFixed(2) || '0.00'}%`} 
          color="bg-indigo-100 text-indigo-600"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Partner Status Distribution</h3>
        <div className="h-64">
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-lg shadow-sm border ${color.split(' ')[0]} flex items-center`}>
    <div className={`p-3 rounded-full ${color} mr-4`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

export default PartnerStats;