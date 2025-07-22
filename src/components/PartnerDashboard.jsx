import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PartnerDashboard = () => {
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.partnerDashboard : enTranslations.partnerDashboard;
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/partner/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setDashboardData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleRequestPayout = async () => {
    setPayoutLoading(true);
    try {
      const response = await axios.post('/api/partner/request-payout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh dashboard data
      const updatedData = await axios.get('/api/partner/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setDashboardData(updatedData.data.data);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setPayoutLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 py-20">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5 text-center">
          <h2 className="text-2xl font-bold text-red-600">{t.errorTitle}</h2>
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Prepare chart data
  const chartData = {
    labels: dashboardData.orders.map(order => formatDate(order.createdAt)),
    datasets: [
      {
        label: t.chart.commissionLabel,
        data: dashboardData.orders.map(order => order.partnerCommission / 100),
        backgroundColor: 'rgba(234, 179, 8, 0.6)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1
      },
      {
        label: t.chart.saleLabel,
        data: dashboardData.orders.map(order => order.finalPrice / 100),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t.chart.title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t.chart.yAxisLabel
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-gray-800 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">{t.welcomeBack}, {dashboardData.partner.name}</h1>
                <p className="mt-2 text-gray-300">{t.subtitle}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(dashboardData.partner.referralLink);
                    alert(t.referralLinkCopied);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  {t.copyReferralLink}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-6 py-8 sm:px-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">{t.stats.totalCommission}</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {formatCurrency(dashboardData.partner.commissionEarned)}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">{t.stats.availableCommission}</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {formatCurrency(dashboardData.partner.availableCommission)}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">{t.stats.totalClients}</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {dashboardData.partner.totalClientsReferred}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">{t.stats.totalSales}</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {dashboardData.partner.totalOrdersReferred}
              </p>
            </div>
          </div>

          {/* Commission Chart */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t.commissionHistory}</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Referrals */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t.recentReferrals}</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.table.client}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.table.plan}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.table.date}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.table.amount}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.table.commission}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.orders.slice(0, 5).map((order, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.client.name}</div>
                            <div className="text-sm text-gray-500">{order.client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.plan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(order.finalPrice)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-yellow-600 font-bold">{formatCurrency(order.partnerCommission)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Section */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t.payoutSection.title}</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{t.payoutSection.availableBalance}</h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {formatCurrency(dashboardData.partner.availableCommission)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {t.payoutSection.minimumPayout.replace('{amount}', formatCurrency(5000))}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={handleRequestPayout}
                    disabled={payoutLoading || dashboardData.partner.availableCommission < 5000}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                      payoutLoading || dashboardData.partner.availableCommission < 5000
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    {payoutLoading ? t.payoutSection.processing : t.payoutSection.requestPayout}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;