import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

Modal.setAppElement("#root");

// Status mapping between display values and backend values
const statusMap = {
  'Pending': 'pending',
  'Processing': 'processing',
  'Completed': 'completed',
  'Cancelled': 'cancelled'
};

const reverseStatusMap = {
  'pending': 'Pending',
  'processing': 'Processing',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'failed': 'Failed'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notes, setNotes] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/api/orders`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm
          }
        });
        
        const formattedOrders = res.data.data.map(order => ({
          ...order,
          status: reverseStatusMap[order.status] || order.status
        }));
        
        setOrders(formattedOrders);
        setTotalPages(Math.ceil(res.data.total / itemsPerPage));
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setPaymentMethod(order.paymentMethod || "");
    setReferenceNumber(order.transactionReference || "");
    setNotes(order.adminNotes || "");
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!status) {
      errors.status = "Status is required";
    }
    
    if (status === "Completed") {
      if (!paymentMethod) {
        errors.paymentMethod = "Payment method is required";
      }
      if (!referenceNumber) {
        errors.referenceNumber = "Reference number is required";
      }
    }
    
    return errors;
  };

  const handleStatusUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (!selectedOrder?._id) {
      toast.error("No order selected");
      return;
    }

    setIsUpdating(true);
    try {
      const backendStatus = statusMap[status];
      
      const updateData = {
        status: backendStatus,
        adminNotes: notes,
        ...(backendStatus === 'completed' && {
          paymentMethod,
          transactionReference: referenceNumber,
          paymentConfirmedAt: new Date().toISOString()
        }),
        ...(backendStatus === 'cancelled' && {
          cancellationReason: 'admin_cancelled'
        })
      };

      const { data } = await api.patch(
        `/api/orders/${selectedOrder._id}`,
        updateData
      );

      setOrders(orders.map((o) => 
        o._id === data.data._id ? {
          ...data.data,
          status: reverseStatusMap[data.data.status] || data.data.status
        } : o
      ));
      
      toast.success(`Order status updated to ${status}`);
      setIsModalOpen(false);
      
      if (status === "Completed") {
        toast.info(
          <div>
            Order marked as completed. 
            <button 
              onClick={() => navigate(`/admin/orders/${selectedOrder._id}/invoice`)}
              className="ml-2 text-blue-500 hover:underline"
            >
              Generate Invoice
            </button>
          </div>,
          { autoClose: 8000 }
        );
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error(
        err.response?.data?.message || err.message || "Update failed"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return "bg-green-100 text-green-800";
      case 'Processing':
        return "bg-blue-100 text-blue-800";
      case 'Cancelled':
      case 'Failed':
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
        <h1 className="text-xl pt-8 sm:text-2xl font-bold">Orders Management</h1>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-2 sm:left-3 top-2 sm:top-2.5 text-gray-400">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          <div className="block md:hidden">
            <div className="space-y-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="bg-white p-3 rounded-lg shadow border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {order.customerDetails?.fullName || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-500">{order.customerDetails?.email || 'N/A'}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Plan</p>
                        <p>{order.plan || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p>€{order.finalPrice || order.originalPrice || '0'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID</p>
                        {order.customerDetails?.idImage ? (
                          <a
                            href={order.customerDetails.idImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            View ID
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No ID</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              )}
            </div>
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden md:block relative">
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {order.customerDetails?.fullName || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerDetails?.email || 'N/A'}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {order.plan || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              €{order.finalPrice || order.originalPrice || '0'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}
                              >
                                {order.status || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {order.customerDetails?.idImage ? (
                                <a
                                  href={order.customerDetails.idImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 text-sm"
                                >
                                  View ID
                                </a>
                              ) : (
                                <span className="text-gray-400 text-sm">No ID</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => openOrderDetail(order)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Manage
                              </button>
                              <button
                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                className="text-gray-600 hover:text-gray-900"
                                title="View Details"
                              >
                                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 sm:mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => !isUpdating && setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          },
          content: {
            position: "relative",
            inset: "auto",
            border: "none",
            background: "white",
            borderRadius: "0.5rem",
            padding: "1rem",
            width: "95%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
        ariaHideApp={false}
      >
        {selectedOrder && selectedOrder.customerDetails && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Manage Order #{selectedOrder._id?.slice(-6).toUpperCase()}
              </h2>
              <button
                onClick={() => !isUpdating && setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUpdating}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3">Customer Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-sm sm:text-base">{selectedOrder.customerDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm sm:text-base break-all">{selectedOrder.customerDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-sm sm:text-base">{selectedOrder.customerDetails.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedOrder.customerDetails.birthday 
                        ? new Date(selectedOrder.customerDetails.birthday).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500">Address</p>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedOrder.customerDetails.address || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3">Order Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Plan</p>
                    <p className="font-medium">{selectedOrder.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Original Price</p>
                    <p className="font-medium">€{selectedOrder.originalPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Final Price</p>
                    <p className="font-medium">€{selectedOrder.finalPrice || selectedOrder.originalPrice}</p>
                  </div>
                  {selectedOrder.partnerCommission > 0 && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Partner Commission</p>
                      <p className="font-medium">€{selectedOrder.partnerCommission}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3">ID Verification</h3>
                {selectedOrder.customerDetails.idImage ? (
                  <div className="flex flex-col items-center">
                    <a
                      href={selectedOrder.customerDetails.idImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-2 text-sm sm:text-base"
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View ID Document
                    </a>
                    <div className="text-xs text-gray-500">
                      Last verified: {selectedOrder.idVerifiedAt ? formatDate(selectedOrder.idVerifiedAt) : 'Not verified'}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm sm:text-base">No ID document uploaded</div>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-6">
              <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Update Order Status</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setValidationErrors({...validationErrors, status: null});
                    }}
                    className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border ${
                      validationErrors.status ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {validationErrors.status && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{validationErrors.status}</p>
                  )}
                </div>

                {status === "Completed" && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setValidationErrors({...validationErrors, paymentMethod: null});
                        }}
                        className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border ${
                          validationErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="">Select payment method</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Other">Other</option>
                      </select>
                      {validationErrors.paymentMethod && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{validationErrors.paymentMethod}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Reference Number *
                      </label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => {
                          setReferenceNumber(e.target.value);
                          setValidationErrors({...validationErrors, referenceNumber: null});
                        }}
                        placeholder="Transaction ID or reference"
                        className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border ${
                          validationErrors.referenceNumber ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {validationErrors.referenceNumber && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{validationErrors.referenceNumber}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or comments about this order..."
                    rows="3"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 sm:space-x-3 pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;