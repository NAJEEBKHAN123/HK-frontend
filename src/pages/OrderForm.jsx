import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import useReferralTracker from "../hook/useReferralTracker"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const OrderForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
 const { getReferralCode, clearReferralCode } = useReferralTracker();

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
    email: "",
    phone: "",
    address: "",
    birthday: "",
    idFile: null,
    plan: validPlan,
    price: price,
    currency: "eur",
    status: "pending",
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
      const file = files[0];
      if (file) {
        // Create preview for ID image
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setForm({ ...form, idFile: file });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePayment = async (orderId) => {
    setPaymentProcessing(true);
    setError("");

    try {
      if (!orderId) {
        throw new Error("Missing order ID for payment processing");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/payments/sessions`,
        {
          orderId,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
          cancelUrl: `${window.location.origin}/payment-cancelled?plan=${form.plan}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else if (response.data.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        if (error) throw error;
      } else {
        throw new Error("Unexpected payment session response");
      }
    } catch (err) {
      let errorMessage = "Payment processing failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setPaymentProcessing(false);
    }
  };

  const uploadIdImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "id_uploads");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dockii7o6/image/upload",
      formData
    );

    if (!response.data.secure_url) {
      throw new Error("ID image upload failed");
    }

    return response.data.secure_url;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Validate required fields
    const requiredFields = ["fullName", "email", "phone", "address", "birthday", "idFile"];
    const missingFields = requiredFields.filter((field) => !form[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Upload ID image
    const idImageUrl = await uploadIdImage(form.idFile);

    // Get and validate referral code
    const referralCode = getReferralCode();
    const isReferral = !!referralCode;

    console.log("Referral code check:", {
      referralCode,
      isValid: isReferral,
      source: referralCode ? "URL/session" : "none"
    });

    // Prepare payload
    const payload = {
      plan: form.plan,
      customerDetails: {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        birthday: form.birthday,
        idImage: idImageUrl,
      },
      clientId: localStorage.getItem("clientId") || undefined,
      referralCode: isReferral ? referralCode : null // Explicit null if no referral
    };

    console.log("Order payload being sent:", payload);

    // Create order
    const orderResponse = await axios.post(
      `${API_BASE_URL}/api/orders`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        timeout: 15000,
      }
    );

    if (!orderResponse.data?.orderId) {
      throw new Error("Order created but no ID returned");
    }

    // Clear referral tracking if this was a referral
    if (isReferral) {
      clearReferralCode();
      console.log("Cleared referral code after order creation");
    }

    await handlePayment(orderResponse.data.orderId);

  } catch (err) {
    console.error("Order submission error:", {
      error: err.response?.data || err.message,
      stack: err.stack
    });
    
    setError(err.response?.data?.message || err.message || "Order submission failed");
    setLoading(false);
  }
};

  const formatPrice = (price) => {
    return `€${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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
            onClick={() => navigate(`/order?plan=${form.plan}`)}
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

        <div className="space-y-4">
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
            {idPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">ID Preview:</p>
                <img
                  src={idPreview}
                  alt="ID Preview"
                  className="mt-1 max-h-40 border rounded"
                />
              </div>
            )}
          </div>
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
            : `${t.pay} ${formatPrice(form.price)}`}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
