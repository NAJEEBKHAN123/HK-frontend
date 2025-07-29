import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ReferredClientsTable = ({ clients }) => {
  const navigate = useNavigate();

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
        You haven't referred any clients yet. Share your referral link to get started!
      </div>
    );
  }

  const viewClientDetails = (clientId) => {
    navigate(`/partner/client/${clientId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Source</th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xs:table-cell">Date Referred</th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client._id} className="hover:bg-gray-50">
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {client.name}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                {client.email}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.source === 'REFERRAL' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {client.source}
                </span>
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.orders?.length || 0} orders
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xs:table-cell">
                {format(new Date(client.createdAt), 'MMM dd, yyyy')}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => viewClientDetails(client._id)}
                  className="text-cyan-600 hover:text-cyan-800 text-xs sm:text-sm"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferredClientsTable;