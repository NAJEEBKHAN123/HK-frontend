import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiUser,
  FiCalendar,
  FiArrowLeft,
  FiActivity,
  FiEdit,
} from "react-icons/fi";
import axios from "axios";

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
    source: "DIRECT",
  });

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("No admin token found");
        }

        const response = await axios.get(`${API_BASE_URL}/api/client/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch client");
        }

        setClient(response.data.data);
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          status: response.data.data.status,
          source: response.data.data.source,
        });
      } catch (err) {
        console.error("Client fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load client details");
        
        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/client/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setClient(response.data.data);
      setShowEditModal(false);
      toast.success("Client updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update client");
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  if (!client) {
    return <div className="text-center py-8">Client not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <Link
          to="/admin/client"
          className="flex items-center pt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <FiArrowLeft className="mr-1 " /> Back to Clients
        </Link>
      </div>

      {/* Client Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUser className="text-blue-600 text-xl sm:text-2xl" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{client.name}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{client.email}</p>
          </div>
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <span
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              client.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {client.status}
          </span>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-xs sm:text-sm"
          >
            <FiEdit className="mr-1" /> Edit
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Client Information Card */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <FiUser className="text-blue-500 mr-2" /> Client Information
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Name:</span>
              <span className="font-medium text-sm sm:text-base">{client.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Email:</span>
              <span className="font-medium text-sm sm:text-base">{client.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Source:</span>
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
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Referred By:</span>
                <div className="text-start sm:text-right">
                  <p className="font-medium text-sm sm:text-base">Name: {client.referredBy.name}</p>
                  <p className="font-medium text-sm sm:text-base">Email: {client.referredBy.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary Card */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <FiActivity className="text-purple-500 mr-2" /> Activity Summary
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Joined:</span>
              <span className="font-medium text-sm sm:text-base">
                {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Last Active:</span>
              <span className="font-medium text-sm sm:text-base">
                {client.lastActive
                  ? new Date(client.lastActive).toLocaleString()
                  : "Never"}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Total Spend:</span>
              <span className="font-medium text-sm sm:text-base">
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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
     

        {/* Activity Log Card */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Activity Log</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiCalendar className="text-blue-600 text-sm sm:text-base" />
              </div>
              <div className="ml-2 sm:ml-3">
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
                <div className="ml-2 sm:ml-3">
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4">Edit Client</h3>
            <form onSubmit={handleUpdateClient}>
              <div className="mb-3 sm:mb-4">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-3 sm:mb-4">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-3 sm:mb-4">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Source
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                >
                  <option value="DIRECT">Direct</option>
                  <option value="REFERRAL">Referral</option>
                </select>
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;