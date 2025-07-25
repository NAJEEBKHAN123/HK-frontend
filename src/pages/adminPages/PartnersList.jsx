import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiMail, FiDollarSign, FiUsers, FiEdit2 } from 'react-icons/fi';

const PartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          `${API_BASE_URL}/api/partner-auth/admin/partners?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setPartners(response.data.partners);
        setTotalPages(response.data.pages);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load partners');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchPartners();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const handleStatusChange = async (partnerId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/partner-auth/admin/partners/${partnerId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setPartners(partners.map(partner => 
        partner._id === partnerId ? { ...partner, status: newStatus } : partner
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Partner Management</h2>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr key={partner._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                      <div className="text-sm text-gray-500">{partner.referralCode}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{partner.email}</div>
                  <div className="text-sm text-gray-500">
                    Joined {new Date(partner.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiUsers className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {partner.totalClientsReferred || 0}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        ${((partner.commissionEarned || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={partner.status}
                    onChange={(e) => handleStatusChange(partner._id, e.target.value)}
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      partner.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/partners/${partner._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit2 className="inline mr-1" /> Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {partners.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No partners found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnersList;