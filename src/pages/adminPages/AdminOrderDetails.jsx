// AdminOrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
  return Promise.reject(error);
});

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        setOrder(res.data.data);
        setStatus(res.data.data.status);
        setPaymentMethod(res.data.data.paymentMethod || "");
        setReferenceNumber(res.data.data.transactionReference || "");
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load order details");
        navigate('/admin/orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleStatusUpdate = async () => {
    if (!orderId) return toast.error("No order selected");

    setIsUpdating(true);
    try {
      const updateData = {
        status,
        ...(status === "Completed" && {
          paymentMethod,
          transactionReference: referenceNumber,
        }),
      };

      const { data } = await api.patch(
        `/api/orders/${orderId}`,
        updateData
      );

      setOrder(data.data);
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Update failed"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Order not found</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-lg font-semibold">Order #{order._id?.slice(-6) || 'N/A'}</h2>
              <p className="text-gray-500">Created: {formatDate(order.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerDetails?.fullName || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.customerDetails?.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {order.customerDetails?.phone || 'N/A'}</p>
              <p><span className="font-medium">Address:</span> {order.customerDetails?.address || 'N/A'}</p>
              
              {order.customerDetails?.idImage && (
                <p>
                  <span className="font-medium">ID Document:</span>{' '}
                  <a
                    href={order.customerDetails.idImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View ID
                  </a>
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Order Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Plan:</span> {order.plan || 'N/A'}</p>
              <p><span className="font-medium">Original Price:</span> €{order.originalPrice || '0'}</p>
              <p><span className="font-medium">Final Price:</span> €{order.finalPrice || order.originalPrice || '0'}</p>
              {order.partnerCommission > 0 && (
                <p><span className="font-medium">Partner Commission:</span> €{order.partnerCommission}</p>
              )}
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'N/A'}</p>
              <p><span className="font-medium">Payment Reference:</span> {order.transactionReference || 'N/A'}</p>
              <p><span className="font-medium">Payment Date:</span> {formatDate(order.paymentConfirmedAt)}</p>
              {order.source === 'REFERRAL' && (
                <p><span className="font-medium">Referral Code:</span> {order.referralCode || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Update Order Status</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {status === "Completed" && (
              <>
                <div className="flex-1">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    id="referenceNumber"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Transaction reference"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;