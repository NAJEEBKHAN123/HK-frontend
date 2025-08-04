import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  FiUser, FiMail, FiDollarSign, FiUsers, 
  FiCalendar, FiTrendingUp, FiActivity, FiArrowLeft 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ReferredClientsForAdmin from '../adminPages/ReferredClientForAdmin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const PartnerDetail = () => {
  const { id } = useParams();
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_BASE_URL}/api/partner-auth/admin/partners/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPartnerData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load partner details');
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_BASE_URL}/api/partner-auth/admin/partners/${id}/payout`,
        { 
          amount: Math.round(parseFloat(payoutAmount) * 100),
          notes: payoutNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const response = await axios.get(`${API_BASE_URL}/api/partner-auth/admin/partners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartnerData(response.data.data);
      setShowPayoutModal(false);
      setPayoutAmount('');
      setPayoutNotes('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payout');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen sm:h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-2 my-4">
      {error}
    </div>
  );

  if (!partnerData || !partnerData.partner) return (
    <div className="text-center py-8 px-4">Partner not found</div>
  );

  const { partner, clients } = partnerData;
  const availableCommission = (partner.commissionEarned || 0) - (partner.commissionPaid || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {/* Back Link */}
        <div className="px-4 py-3 border-b">
          <Link 
            to="/admin/partners" 
            className="inline-flex items-center pt-4 text-blue-600 hover:text-blue-800 text-sm"
          >
            <FiArrowLeft className="mr-1" /> Back to Partners
          </Link>
        </div>

        {/* Header Section */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-600 text-xl sm:text-2xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {partner.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 break-all">
                  {partner.email}
                </p>
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                partner.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {partner.status.toUpperCase()}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                Joined {new Date(partner.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 gap-4 mb-6">
            {/* Commission Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FiDollarSign className="text-green-500 mr-2" />
                <h3 className="text-sm sm:text-base font-semibold">Commission Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Earned:</span>
                  <span className="font-medium">${(partner.commissionEarned / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-medium">${(partner.commissionPaid / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                  <span className="text-gray-600">Available:</span>
                  <span className="text-blue-600">${(availableCommission / 100).toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  disabled={availableCommission <= 0}
                  className={`w-full mt-3 py-2 rounded-md text-sm ${
                    availableCommission <= 0 
                      ? 'bg-gray-200 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Process Payout
                </button>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FiUsers className="text-blue-500 mr-2" />
                <h3 className="text-sm sm:text-base font-semibold">Referral Performance</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Referral Code:</span>
                  <span className="font-medium">{partner.referralCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Clicks:</span>
                  <span className="font-medium">{partner.referralClicks || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Clients Referred:</span>
                  <span className="font-medium">{clients?.length || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="text-green-600">{partner.conversionRate}%</span>
                </div>
              </div>
            </div>

          </div>

           {/* Activity Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiCalendar className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Account Created</p>
                    <p className="text-sm text-gray-500">
                      {new Date(partner.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {partner.orders?.length > 0 && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FiTrendingUp className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Recent Referral</p>
                      <p className="text-sm text-gray-500">
                        {partner.orders.length} orders totaling $
                        {(partner.orders.reduce((sum, order) => sum + (order.finalPrice || 0), 0) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clients Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                Referred Clients ({clients?.length || 0})
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <ReferredClientsForAdmin clients={clients || []} />
            </div>
          </div>

         
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4">Process Payout</h3>
              <form onSubmit={handlePayoutSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Amount (Max: ${(availableCommission / 100).toFixed(2)})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={(availableCommission / 100).toFixed(2)}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={payoutNotes}
                    onChange={(e) => setPayoutNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Confirm Payout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDetail;