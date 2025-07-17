import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const stripePromise = loadStripe(
  "pk_test_51RcrVXRszf61FaWlatvMzc8iR5uDQPrI9fJ0TC2c3uekoMp6I3ClIl5VJnkVbQamDOY6dsB35K2e2gq0OlGKH8k000lgfpXzvh"
);

const OrderForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { language } = useContext(LanguageContext);

  const t =
    language === "fr" ? frTranslations.orderForm : enTranslations.orderForm;

  const planPrices = {
    STARTER: 3900,
    TURNKEY: 4600,
    PREMIUM: 9800,
  };

  const planDisplayNames = {
    en: {
      STARTER: "STARTER Pack",
      TURNKEY: "TURNKEY Pack",
      PREMIUM: "PREMIUM Pack",
    },
    fr: {
      STARTER: "Pack STARTER",
      TURNKEY: "Pack TURNKEY",
      PREMIUM: "Pack PREMIUM",
    },
  };

  const planKey = queryParams.get("plan");
  const priceParam = queryParams.get("price");

  const validPlan = Object.keys(planPrices).includes(planKey)
    ? planKey
    : "STARTER";

  const price =
    priceParam && !isNaN(Number(priceParam))
      ? Number(priceParam)
      : planPrices[validPlan];

  const [form, setForm] = useState({
    fullName: "",
    birthday: "",
    address: "",
    phone: "",
    email: "",
    idFile: null,
    plan: validPlan,
    price: price,
    currency: "eur",
    status: "Pending Payment",
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setPaymentStatus("success");
      setSuccess(true);
    }
    if (query.get("cancelled")) {
      setPaymentStatus("cancelled");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idFile") {
      setForm({ ...form, idFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePayment = async (orderId) => {
    setPaymentProcessing(true);
    setError("");

    try {
      // Validate orderId exists
      if (!orderId) {
        throw new Error("Missing order ID for payment processing");
      }

      const orderDetails = {
        orderId,
        amount: form.price,
        currency: form.currency,
        customerEmail: form.email,
        customerPhone: form.phone,
        plan: form.plan,
      };

      // Store order details temporarily
      sessionStorage.setItem("currentOrder", JSON.stringify(orderDetails));

      // Create payment session with error handling
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/sessions`,
        {
          ...orderDetails,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
          cancelUrl: `${window.location.origin}/payment-cancelled?order_id=${orderId}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 second timeout
        }
      );

      if (!response.data) {
        throw new Error("Empty response from payment server");
      }

      // Handle different payment provider responses
      if (response.data.url) {
        // Direct URL redirect
        window.location.href = response.data.url;
      } else if (response.data.sessionId || response.data.id) {
        // Stripe.js redirect
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId || response.data.id,
        });
        if (error) throw error;
      } else {
        throw new Error("Unexpected payment session response format");
      }
    } catch (err) {
      let errorMessage = "Payment processing failed. Please try again.";

      if (err.response) {
        // Handle specific HTTP error codes
        if (err.response.status === 500) {
          errorMessage =
            "Payment service is currently unavailable. Please try again later.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setPaymentProcessing(false);

      // Optional: Add retry logic here if needed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate all required fields
      const requiredFields = {
        fullName: t.errors.fullName,
        email: t.errors.email,
        phone: t.errors.phone,
        birthday: t.errors.birthday,
        address: t.errors.address,
        idFile: t.errors.idFile,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !form[field]?.toString().trim())
        .map(([_, message]) => message);

      if (missingFields.length > 0) {
        throw new Error(missingFields.join(", "));
      }

      // Upload ID document to Cloudinary
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", form.idFile);
      cloudinaryForm.append("upload_preset", "id_uploads");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dockii7o6/image/upload",
        cloudinaryForm
      );

      if (!cloudinaryRes.data.secure_url) {
        throw new Error("ID document upload failed - no secure URL returned");
      }

      // Prepare order payload
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        birthday: form.birthday,
        address: form.address.trim(),
        idImage: cloudinaryRes.data.secure_url,
        plan: form.plan.toUpperCase(),
        price: form.price,
        currency: form.currency,
        metadata: {
          source: "web-form",
          campaign: "hong-kong-company",
        },
      };

      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/orders`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract order ID from various possible response structures
      const orderId =
        orderResponse.data?._id ||
        orderResponse.data?.id ||
        orderResponse.data?.orderId ||
        orderResponse.data?.order?._id ||
        orderResponse.data?.order?.id ||
        orderResponse.data?.data?._id;

      if (!orderId) {
        throw new Error(
          "Order created successfully but no ID returned. Please contact support."
        );
      }

      await handlePayment(orderId);
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.message;

      // Handle specific error cases
      if (err.response?.status === 409) {
        errorMessage = "An order with this email already exists";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid data submitted. Please check your information.";
      }

      setError(errorMessage || "Failed to submit order. Please try again.");
      setLoading(false);

      // Optional: Re-enable the form for correction
    }
  };
  const formatPrice = (amount) => {
    return `€${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const getDisplayPlanName = () => {
    return (
      planDisplayNames[language][form.plan] || planDisplayNames.en[form.plan]
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 py-20">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5 text-center">
          <h2 className="text-2xl font-bold text-green-600">
            {paymentStatus === "success"
              ? t.paymentSuccess.title
              : t.success.title}
          </h2>
          <p className="text-lg">
            {paymentStatus === "success"
              ? t.paymentSuccess.message.replace("{plan}", getDisplayPlanName())
              : t.success.message.replace("{plan}", getDisplayPlanName())}
          </p>
          <p>
            {t.success.totalLabel}: <strong>{formatPrice(form.price)}</strong>
          </p>
          <div className="pt-4">
            <p
              className="text-gray-600"
              dangerouslySetInnerHTML={{
                __html: t.success.contact
                  .replace(`{email}`, `<strong>${form.email}</strong>`)
                  .replace("{phone}", `<strong>${form.phone}</strong>`),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "cancelled") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 py-20">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            {t.paymentCanceled.title}
          </h2>
          <p className="text-lg">{t.paymentCanceled.message}</p>
          <button
            onClick={() => {
              setPaymentStatus(null);
              setError("");
            }}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            {t.paymentCanceled.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 sm:px-6 py-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {t.title}
        </h2>

        <div className="text-center">
          <p className="text-gray-600">
            {t.planLabel}:{" "}
            <span className="font-semibold text-yellow-600">
              {getDisplayPlanName()}
            </span>
          </p>
          <p className="text-lg font-medium text-black mt-1">
            {t.totalLabel}: {formatPrice(form.price)}
          </p>
        </div>

        {[
          { name: "fullName", label: t.fields.fullName, type: "text" },
          { name: "email", label: t.fields.email, type: "email" },
          { name: "phone", label: t.fields.phone, type: "tel" },
          { name: "birthday", label: t.fields.birthday, type: "date" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} *
            </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.address} *
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.idUpload} *
          </label>
          <input
            type="file"
            name="idFile"
            onChange={handleChange}
            accept=".jpg,.jpeg,.png,.pdf"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || paymentProcessing}
          className={`w-full py-3 px-6 rounded-md font-semibold text-white ${
            loading || paymentProcessing
              ? "bg-gray-400"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading
            ? t.buttons.submitting
            : paymentProcessing
            ? t.buttons.processingPayment
            : `${formatPrice(form.price)} ${t.pay}`}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
