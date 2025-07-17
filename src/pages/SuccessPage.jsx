import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import axios from "axios";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.paymentSuccess : enTranslations.paymentSuccess;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const sessionId = searchParams.get('session_id');

  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const transformOrderData = (apiResponse) => {
    if (!apiResponse?.success || !apiResponse.data) {
      console.error('Invalid order data structure:', apiResponse);
      throw new Error(t.invalidOrderData || 'Invalid order data received');
    }
    
    const orderData = apiResponse.data;
    const currentTime = new Date().toISOString();

    return {
      ...orderData,
      price: orderData.price || orderData.amount || 0,
      plan: orderData.plan || orderData.product?.name || 'Standard Plan',
      status: (orderData.status || 'completed').toLowerCase(),
      _id: orderData._id || orderData.id || 'N/A',
      createdAt: orderData.createdAt || currentTime,
      email: orderData.email || orderData.customer?.email || '',
      // Add exact timestamp for token generation
      timestamp: currentTime
    };
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!sessionId) {
          throw new Error(t.missingSessionId || 'Missing session ID');
        }

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

        const orderResponse = await axios.get(
          `${API_BASE_URL}/api/orders/${verificationResponse.data.orderId}`,
          { 
            headers: { 'Accept': 'application/json' },
            timeout: 10000
          }
        );

        const transformedOrder = transformOrderData(orderResponse.data);
        setOrder(transformedOrder);

      } catch (error) {
        console.error("Payment verification failed:", error);
        setError(
          error.response?.data?.message || 
          error.message || 
          t.errorProcessingPayment || 
          'Error processing payment'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, t]);

  const handleDownload = async () => {
    try {
      if (!order?._id) {
        throw new Error(t.noOrderAvailable || 'No order available for download');
      }
      
      setDownloading(true);
      setDownloadError(null);
      
      // Include exact timestamp in token request
      const tokenResponse = await axios.post(
        `${API_BASE_URL}/api/payments/orders/${order._id}/download-token`,
        {
          timestamp: order.timestamp
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000
        }
      );

      if (!tokenResponse.data?.token) {
        throw new Error(t.tokenGenerationFailed || 'Failed to generate download token');
      }

      // Create download URL with exact timestamp
      const downloadUrl = `${API_BASE_URL}/api/payments/orders/${order._id}/receipt?token=${tokenResponse.data.token}&timestamp=${encodeURIComponent(order.timestamp)}`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `receipt-${order._id}-${new Date(order.timestamp).getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError(
        error.response?.data?.message || 
        (process.env.NODE_ENV === 'development' ? error.message : '') || 
        t.downloadFailed || 
        'Failed to download receipt'
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleContactSupport = () => {
    navigate('/contact', {
      state: {
        prefilledData: {
          email: order?.email || '',
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
            {t.errorTitle || 'Error'}
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {t.returnHome || 'Return home'}
            </button>
            <button
              onClick={handleContactSupport}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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
          
          <h2 className="mt-3 text-2xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-2 text-gray-600">{t.message}</p>
          
          {order ? (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg text-left">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {t.reference || 'Reference'}:
                </p>
                <p className="text-sm text-gray-900 break-all">{order._id}</p>
                
                <p className="text-sm font-medium text-gray-700">
                  {t.plan || 'Plan'}:
                </p>
                <p className="text-sm text-gray-900">{order.plan}</p>
                
                <p className="text-sm font-medium text-gray-700">
                  {t.amount || 'Amount'}:
                </p>
                <p className="text-sm text-gray-900">
                  {formatPrice(order.price)}
                </p>
                
                <p className="text-sm font-medium text-gray-700">
                  {t.status || 'Status'}:
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {order.status}
                </p>

                <p className="text-sm font-medium text-gray-700">
                  {t.date || 'Date'}:
                </p>
                <p className="text-sm text-gray-900">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                {t.noOrderDetails || 'Order details not available'}
              </p>
            </div>
          )}

          {downloadError && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">{downloadError}</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading || !order}
              className={`w-full px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
                downloading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : order
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.downloading || 'Preparing download...'}
                </>
              ) : (
                t.download || 'Download Receipt'
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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