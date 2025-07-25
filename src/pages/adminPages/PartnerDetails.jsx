import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  FiUser, FiMail, FiDollarSign, FiUsers, FiCreditCard, 
  FiCalendar, FiTrendingUp, FiActivity, FiArrowLeft 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


const PartnerDetail = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
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
        setPartner(response.data.partner);
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
      
      // Refresh partner data
      const response = await axios.get(`${API_BASE_URL}/api/partner-auth/admin/partners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartner(response.data.partner);
      
      setShowPayoutModal(false);
      setPayoutAmount('');
      setPayoutNotes('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payout');
    }
  };

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

  if (!partner) return <div>Partner not found</div>;

  const availableCommission = (partner.commissionEarned || 0) - (partner.commissionPaid || 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <Link to="/admin/partners" className="flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-1" /> Back to Partners
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUser className="text-blue-600 text-2xl" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900">{partner.name}</h2>
            <p className="text-gray-500">{partner.email}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            partner.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {partner.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiDollarSign className="text-green-500 mr-2" /> Commission Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Earned:</span>
              <span className="font-medium">${(partner.commissionEarned / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-medium">${(partner.commissionPaid / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">Available:</span>
              <span className="font-bold text-blue-600">${(availableCommission / 100).toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={availableCommission <= 0}
              className={`w-full mt-4 py-2 rounded-md ${
                availableCommission <= 0 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Process Payout
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiUsers className="text-blue-500 mr-2" /> Referral Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Referral Code:</span>
              <span className="font-medium">{partner.referralCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Clicks:</span>
              <span className="font-medium">{partner.referralClicks || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Clients Referred:</span>
              <span className="font-medium">{partner.totalClientsReferred || 0}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">Conversion Rate:</span>
              <span className="font-bold text-green-600">
                {partner.referralClicks > 0 
                  ? `${((partner.totalClientsReferred / partner.referralClicks) * 100).toFixed(2)}%` 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiActivity className="text-purple-500 mr-2" /> Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200">
              Send Message
            </button>
            <button className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200">
              Update Profile
            </button>
            <button 
              className={`w-full py-2 rounded-md ${
                partner.status === 'active'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              onClick={() => {
                const newStatus = partner.status === 'active' ? 'inactive' : 'active';
                axios.put(
                  `/api/partner-auth/admin/partners/${id}/status`,
                  { status: newStatus },
                  { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
                );
                setPartner({ ...partner, status: newStatus });
              }}
            >
              {partner.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Referred Clients ({partner.clients?.length || 0})</h3>
          {partner.clients?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {partner.clients.map(client => (
                    <tr key={client._id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{client.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No clients referred yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
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

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDetail;