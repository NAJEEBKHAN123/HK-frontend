import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiDollarSign } from 'react-icons/fi';
import { format } from 'date-fns';

const ReferredClientsForAdmin = ({ clients }) => {
  const navigate = useNavigate();

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
        No clients referred yet.
      </div>
    );
  }

  const viewClientDetails = (clientId) => {
    navigate(`/admin/client/${clientId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client._id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500 sm:hidden">{client.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                <div className="text-sm text-gray-900">{client.email}</div>
                <div className="text-sm text-gray-500">{client.phone || 'No phone'}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                  <FiDollarSign className="mr-1" />
                  {((client.totalSpent || 0) / 100).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">{client.orders?.length || 0} orders</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(client.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => viewClientDetails(client._id)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferredClientsForAdmin;