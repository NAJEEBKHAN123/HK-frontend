import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import axios from "axios";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL;

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.paymentSuccess : enTranslations.paymentSuccess;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  console.log("session ID", sessionId)
  console.log("order ID", orderId)

  

  const formatPrice = (price) => {
    return `€${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

   useEffect(() => {
    const verifyPayment = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!sessionId || !orderId) {
          throw new Error(t.missingSessionId || 'Missing payment information');
        }

        // First verify the payment session
        const verificationResponse = await axios.get(
          `${API_BASE_URL}/api/payments/verify/${sessionId}`,
          { 
            headers: { 'Accept': 'application/json' },
            timeout: 10000
          }
        );

        if (!verificationResponse.data?.success) {
          throw new Error(t.paymentVerificationFailed || 'Payment verification failed');
        }

        // Then get order details using the public endpoint
        const orderResponse = await axios.get(
          `${API_BASE_URL}/api/orders/${orderId}/public`,
          { 
            headers: { 'Accept': 'application/json' },
            timeout: 10000
          }
        );

        if (!orderResponse.data?.success) {
          throw new Error('Order details not found');
        }

        setOrder({
          ...orderResponse.data.data,
          price: orderResponse.data.data.price || orderResponse.data.data.amount,
          plan: orderResponse.data.data.plan || 'STARTER Pack',
          status: 'completed'
        });

      } catch (error) {
        console.error("Payment verification failed:", error);
        let errorMessage = t.errorProcessingPayment || 'Error processing payment';
        
        if (error.response) {
          // Handle HTTP error responses
          if (error.response.status === 401) {
            errorMessage = 'Session expired. Please log in again.';
          } else if (error.response.status === 404) {
            errorMessage = 'Order not found';
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId, t]);

  const handleDownloadReceipt = async () => {
    try {
      if (!order?._id) {
        throw new Error(t.noOrderAvailable || 'No order available');
      }

      const tokenResponse = await axios.post(
        `${API_BASE_URL}/api/payments/orders/${order._id}/download-token`,
        {},
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!tokenResponse.data?.token) {
        throw new Error(t.tokenGenerationFailed || 'Failed to generate download token');
      }

      window.open(
        `${API_BASE_URL}/api/payments/orders/${order._id}/receipt?token=${tokenResponse.data.token}`,
        '_blank'
      );
    } catch (error) {
      console.error('Download failed:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        t.downloadFailed || 
        'Failed to download receipt'
      );
    }
  };

  const handleContactSupport = () => {
    navigate('/contact', {
      state: {
        prefilledData: {
          email: order?.customerDetails?.email || '',
          subject: language === 'fr' ? 'Confirmation de paiement' : 'Payment confirmation',
          message: language === 'fr' 
            ? `J'ai une question concernant ma commande payée (référence: ${order?._id || 'inconnue'})`
            : `I have a question about my paid order (reference: ${order?._id || 'unknown'})`
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {t.processingPayment || 'Verifying your payment...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {t.errorTitle || 'Payment Issue'}
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {t.returnHome || 'Return home'}
            </button>
            <button
              onClick={handleContactSupport}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {t.contactSupport || 'Contact Support'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {t.title || 'Payment Successful!'}
          </h2>
          <p className="mt-2 text-gray-600">
            {t.message || 'Thank you for your purchase. Your order has been confirmed.'}
          </p>
          
          {order && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.orderNumber || 'Order Number'}:</span>
                <span className="font-medium">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.plan || 'Plan'}:</span>
                <span className="font-medium">{order.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.amount || 'Amount'}:</span>
                <span className="font-medium">{formatPrice(order.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.date || 'Date'}:</span>
                <span className="font-medium">{formatDateTime(order.createdAt)}</span>
              </div>
              {order.customerDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{order.customerDetails.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.customerDetails.email}</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {t.downloadReceipt || 'Download Receipt'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {t.returnHome || 'Return Home'}
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleContactSupport}
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {t.contactSupport || 'Contact Support'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;