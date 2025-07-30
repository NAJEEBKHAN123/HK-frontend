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
        if (!token) {
          throw new Error('No admin token found');
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/partner-auth/admin/partners`,
          {
            params: {
              page: currentPage,
              limit: limit,
              search: searchTerm
            },
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setPartners(response.data.partners);
        setTotalPages(response.data.pages || 1);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load partners');
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
      
      setPartners(partners.map(partner => 
        partner._id === partnerId ? { ...partner, status: newStatus } : partner
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
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
    <div className="bg-white rounded-lg shadow p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pt-4 mb-3 sm:mb-0">Partner Management</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block sm:hidden space-y-3">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <div key={partner._id} className="bg-white p-3 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 text-sm">{partner.name}</h3>
                    <p className="text-gray-500 text-xs">{partner.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  partner.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {partner.status}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Clients</p>
                  <p className="flex items-center">
                    <FiUsers className="text-gray-400 mr-1" />
                    {partner.totalClientsReferred || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Commission</p>
                  <p className="flex items-center">
                    <FiDollarSign className="text-gray-400 mr-1" />
                    ${((partner.commissionEarned || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
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
                <Link
                  to={`/admin/partners/${partner._id}`}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiEdit2 className="mr-1" /> Manage
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No partners found
          </div>
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr key={partner._id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <div className="ml-2 sm:ml-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                        {partner.name}
                      </div>
                      <div className="text-xs text-gray-500">{partner.referralCode}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900 break-all">{partner.email}</div>
                  <div className="text-xs text-gray-500">
                    Joined {new Date(partner.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="flex items-center">
                      <FiUsers className="text-gray-400 mr-1 text-xs sm:text-sm" />
                      <span className="text-xs sm:text-sm text-gray-900">
                        {partner.totalClientsReferred || 0}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="text-gray-400 mr-1 text-xs sm:text-sm" />
                      <span className="text-xs sm:text-sm text-gray-900">
                        ${((partner.commissionEarned || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <select
                    value={partner.status}
                    onChange={(e) => handleStatusChange(partner._id, e.target.value)}
                    className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium ${
                      partner.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                  <Link
                    to={`/admin/partners/${partner._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3 inline-flex items-center"
                  >
                    <FiEdit2 className="mr-1" /> <span className="hidden sm:inline">Manage</span>
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
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
              currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white'
            }`}
          >
            Previous
          </button>
          <span className="text-xs sm:text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
              currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnersList;