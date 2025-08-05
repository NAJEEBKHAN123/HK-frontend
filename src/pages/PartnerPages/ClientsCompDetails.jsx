import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiArrowLeft,
  FiCreditCard,
  FiActivity,
  FiEdit,
} from "react-icons/fi";
import axios from "axios";

const ClientCompDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No admin token find");
  }

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No admin token found");
        }

        const response = await axios.get(`${API_BASE_URL}/api/client/partner/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch client");
        }

        setClient(response.data.data);
      } catch (err) {
        console.error("Client fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load client details");
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  if (!client) return <div>Client not found</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4 pt-8 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <Link   
          to="/partner/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <FiArrowLeft className="mr-1" /> Back to Clients
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUser className="text-blue-600 text-xl sm:text-2xl" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{client.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500">{client.email}</p>
          </div>
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <span
            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
              client.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {client.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <FiUser className="text-blue-500 mr-2" /> Client Information
          </h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{client.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Source:</span>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  client.source === "REFERRAL"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {client.source}
              </span>
            </div>
            {client.referredBy && (
              <div className="flex justify-between">
                <span className="text-gray-600">Referred By:</span>
                <div className="text-start">
                  <p className="font-medium">Name: {client.referredBy.name}</p>
                  <p className="font-medium">Email: {client.referredBy.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <FiActivity className="text-purple-500 mr-2" /> Activity Summary
          </h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Joined:</span>
              <span className="font-medium">
                {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Active:</span>
              <span className="font-medium">
                {client.lastActive
                  ? new Date(client.lastActive).toLocaleString()
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Orders:</span>
              <span className="font-medium">{client.orders?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Spend:</span>
              <span className="font-medium">
                $
                {(
                  client.orders?.reduce(
                    (sum, order) => sum + (order.total || 0),
                    0
                  ) / 100 || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Recent Orders ({client.orders?.length || 0})
          </h3>
          {client.orders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        ${(order.total / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">No orders found.</p>
          )}
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Activity Log</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiCalendar className="text-blue-600 text-sm sm:text-base" />
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  Account Created
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(client.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {client.lastLogin && (
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FiUser className="text-green-600 text-sm sm:text-base" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    Last Login
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(client.lastLogin).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCompDetail;