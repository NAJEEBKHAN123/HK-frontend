import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiMail, FiShoppingBag, FiCalendar } from 'react-icons/fi';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No admin token found');
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/client/admin`,
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
        
        setClients(response.data.data);
        setTotalPages(response.data.pages || 1);
      } catch (err) {
        console.error("API Error Details:", {
          message: err.message,
          response: err.response?.data,
          stack: err.stack
        });
        setError(err.response?.data?.message || err.message || 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchClients();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 pt-6 sm:mb-0">Client Management</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-8 sm:pl-10 pr-3 py-1 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
            placeholder="Search clients..."
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
        {clients.length > 0 ? (
          clients.map((client) => (
            <div key={client._id} className="bg-white p-3 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 text-sm">{client.name}</h3>
                    <p className="text-gray-500 text-xs">{client.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  client.source === 'REFERRAL' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.source}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p>{new Date(client.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Orders</p>
                  <p className="flex items-center">
                    <FiShoppingBag className="text-gray-400 mr-1" />
                    {client.orders?.length || 0}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <Link
                  to={`/admin/client/${client._id}`}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No clients found
          </div>
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client._id}>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">ID: {client._id.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.email}</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Joined {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium ${
                    client.source === 'REFERRAL' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.source}
                  </span>
                  {client.referralCode && (
                    <div className="text-xs text-gray-500 mt-1">Code: {client.referralCode}</div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiShoppingBag className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">
                      {client.orders?.length || 0} orders
                    </span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/client/${client._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3 text-xs sm:text-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No clients found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
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

export default ClientsList;