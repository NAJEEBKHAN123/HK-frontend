import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const CancelPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.paymentCancelled : enTranslations.paymentCanceled;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = searchParams.get('order_id');


   const formatPrice = (price) => {
    return `€${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const transformOrderData = (apiResponse) => {
    if (!apiResponse?.success || !apiResponse.data) {
      console.error('Invalid order data structure:', apiResponse);
      return null;
    }
    
    const orderData = apiResponse.data;
    console.log('Raw order data received:', orderData);

    try {
      // Extract price - check multiple possible fields
      const priceValue = orderData.price || 
                       orderData.amount || 
                       (orderData.product && orderData.product.price) || 
                       0;

      // Extract plan name - check multiple possible fields
      const planName = orderData.plan || 
                      orderData.product?.name || 
                      orderData.productName || 
                      'Standard Plan';

      return {
        ...orderData,  // Spread all original fields
        price: typeof priceValue === 'number' ? priceValue : parseInt(priceValue, 10) || 0,
        plan: planName,
        status: (orderData.status || 'cancelled').toLowerCase(),
        _id: orderData._id || orderData.id || 'N/A'
      };
    } catch (error) {
      console.error('Error transforming order data:', error);
      return {
        ...orderData,
        price: 0,
        plan: 'Standard Plan',
        status: 'cancelled',
        _id: orderData._id || 'N/A'
      };
    }
  };

  useEffect(() => {
    const handleCancellation = async () => {
      try {
        if (!orderId) {
          throw new Error(t.missingOrderId || 'Missing order ID');
        }

        console.log('Fetching order details for:', orderId);
        
        // 1. First get the current order details
        const orderResponse = await axios.get(
          `${API_BASE_URL}/api/orders/${orderId}`,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        console.log('Full API response:', orderResponse);

        if (!orderResponse.data?.success) {
          throw new Error(t.errorLoadingOrder || 'Order data not found');
        }

        const transformedOrder = transformOrderData(orderResponse.data);
        console.log('Transformed order data:', transformedOrder);
        setOrder(transformedOrder);

        // 2. Then cancel the payment session
        console.log('Cancelling payment session for order:', orderId);
        const cancelResponse = await axios.post(
          `${API_BASE_URL}/api/payments/sessions/${orderId}/cancel`,
          { reason: 'user_cancelled' },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (!cancelResponse.data?.success) {
          console.warn('Payment session cancellation may not have succeeded');
        }

        // 3. Finally, fetch the updated order details
        console.log('Fetching updated order details');
        const updatedOrderResponse = await axios.get(
          `${API_BASE_URL}/api/orders/${orderId}`,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        if (updatedOrderResponse.data?.success) {
          const updatedOrder = transformOrderData(updatedOrderResponse.data);
          console.log('Updated order data:', updatedOrder);
          setOrder(updatedOrder);
        }
        
      } catch (error) {
        console.error("Cancellation process failed:", {
          error: error.message,
          response: error.response?.data,
          stack: error.stack
        });
        
        setError(
          error.response?.data?.message || 
          error.message || 
          t.errorProcessingCancellation || 
          'Error processing cancellation'
        );
      } finally {
        setLoading(false);
      }
    };

    handleCancellation();
  }, [orderId, t]);

  const handleRetryPayment = () => {
    if (!order) return;
    
    navigate('/order-form', {
      state: {
        prefilledData: {
          plan: order.plan,
          price: order.price,
          email: order.email,
          phone: order.phone,
          fullName: order.fullName,
          address: order.address,
          birthday: order.birthday?.split('T')[0]
        }
      }
    });
  };

  const handleContactSupport = () => {
    navigate('/contact', {
      state: {
        prefilledData: {
          email: order?.email || '',
          subject: language === 'fr' ? 'Annulation de commande' : 'Order cancellation',
          message: language === 'fr' 
            ? `J'ai besoin d'aide concernant ma commande annulée (référence: ${order?._id || 'inconnue'})`
            : `I need help regarding my cancelled order (reference: ${order?._id || 'unknown'})`
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {t.processingCancellation || 'Processing your cancellation...'}
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
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {t.errorTitle || 'Error'}
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {t.returnHome || 'Return home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="mt-3 text-2xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-2 text-gray-600">{t.message}</p>
          
          {order ? (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg text-left">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {t.reference || 'Reference'}:
                </p>
                <p className="text-sm text-gray-900">{order._id}</p>
                
                <p className="text-sm font-medium text-gray-700">
                  {t.plan || 'Plan'}:
                </p>
                <p className="text-sm text-gray-900">{order.plan}</p>
                
                <p className="text-sm font-medium text-gray-700">
                  {t.amount || 'Amount'}:
                </p>
                <p className="text-sm text-gray-900">
                  {order.price ? `${formatPrice(order.price)}` : '€0'}
                </p>
                
                <p className="text-sm font-medium text-gray-700">
                  {t.status || 'Status'}:
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {order.status}
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

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={handleRetryPayment}
              disabled={!order}
              className={`w-full px-4 py-2 rounded-md transition-colors ${
                order 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.retryPayment || 'Try Again'}
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

export default CancelPage;