import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import useReferralTracker from "../hook/useReferralTracker";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const OrderForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [idPreview, setIdPreview] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    customerName: "",
    email: "",
    phone: "",
    plan: "",
    price: 0,
  });

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idFile") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setForm((prev) => ({ ...prev, idFile: file }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPrice = (priceInEuros) => {
    return priceInEuros.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    });
  };

  const uploadIdImage = async (file) => {
    try {
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
    } catch (err) {
      console.error("Image upload error:", err);
      throw new Error("Failed to upload ID image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const requiredFields = [
        "fullName",
        "email",
        "phone",
        "address",
        "birthday",
        "idFile",
      ];
      const missingFields = requiredFields.filter((field) => !form[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const idImageUrl = await uploadIdImage(form.idFile);
      const referralCode = getReferralCode();
      const isReferral = !!referralCode;

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
        referralCode: isReferral ? referralCode : null,
      };

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

      if (isReferral) {
        clearReferralCode();
      }

      setOrderDetails({
        orderId: orderResponse.data.orderId,
        customerName: form.fullName,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        price: form.price,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Order submission error:", err);
      setError(
        err.response?.data?.message || err.message || "Order submission failed"
      );
      setLoading(false);
    }
  };

  const getDisplayPlanName = () => {
    return (
      planDisplayNames[language]?.[form.plan] ||
      planDisplayNames.en[form.plan] ||
      form.plan
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 py-20">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold text-green-600 text-center">
            {t.success?.title || "Order Successful"}
          </h2>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                {t.success?.orderConfirmed || "Order Confirmed"}
              </h3>
              <p className="text-green-700">
                {t.success?.orderNumber || "Order number"}:{" "}
                <strong>{orderDetails.orderId}</strong>
              </p>
            </div>

            <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                {t.success?.paymentInstructions || "Payment Instructions"}
              </h3>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {t.success?.pleaseTransfer || "Please transfer"}
                  <strong className="text-blue-600">
                    {" "}
                    {formatPrice(orderDetails.price)}{" "}
                  </strong>
                  {t.success?.toOurBankAccount || "to our bank account"}
                </p>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[280px]">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-2 px-1 font-medium text-gray-700 whitespace-nowrap">
                            {t.success?.bankName || "Bank Name"}:
                          </td>
                          <td className="py-2 px-1">Your Bank Name</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-1 font-medium text-gray-700 whitespace-nowrap">
                            {t.success?.accountHolder || "Account Holder"}:
                          </td>
                          <td className="py-2 px-1">Your Company Name</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-1 font-medium text-gray-700 whitespace-nowrap">
                            IBAN:
                          </td>
                          <td className="py-2 px-1 font-mono tracking-tight break-all">
                            FR76 3000 4000 5000 6000 7000 123
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-1 font-medium text-gray-700 whitespace-nowrap">
                            BIC/SWIFT:
                          </td>
                          <td className="py-2 px-1 font-mono tracking-tight">
                            BANKFRPPXXX
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-1 font-medium text-gray-700 whitespace-nowrap">
                            {t.success?.reference || "Reference"}:
                          </td>
                          <td className="py-2 px-1 font-mono tracking-tight break-all">
                            ORDER-{orderDetails.orderId}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-sm text-gray-600 italic">
                  {t.success?.paymentProcessingTime ||
                    "Your order will be processed once payment is received (usually within 1-2 business days)."}
                </p>

                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {t.success?.paymentNote ||
                        "Please include the reference number in your payment details."}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">
                {t.success?.nextSteps || "Next Steps"}
              </h3>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                <li>
                  {t.success?.step1 ||
                    "Complete the bank transfer using the information above"}
                </li>
                <li>
                  {t.success?.step2 ||
                    "Send the payment confirmation to our email"}
                </li>
                <li>
                  {t.success?.step3 ||
                    "We'll contact you to complete the process"}
                </li>
              </ol>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                {t.success?.contactInfo || "We'll contact you at"}:{" "}
                <strong>{orderDetails.email}</strong> {t.success?.or || "or"}{" "}
                <strong>{orderDetails.phone}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t.success?.contactSupport ||
                  "For any questions, please contact our support team."}
              </p>
            </div>
          </div>
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
          {t.title || "Order Form"}
        </h2>

        <div className="text-center">
          <p className="text-gray-600">
            {t.planLabel || "Plan"}:{" "}
            <span className="font-semibold text-yellow-600">
              {getDisplayPlanName()}
            </span>
          </p>
          <p className="text-lg font-medium text-black mt-1">
            {t.totalLabel || "Total"}: {formatPrice(form.price)}
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              name: "fullName",
              label: t.fields?.fullName || "Full Name",
              type: "text",
            },
            { name: "email", label: t.fields?.email || "Email", type: "email" },
            { name: "phone", label: t.fields?.phone || "Phone", type: "tel" },
            {
              name: "birthday",
              label: t.fields?.birthday || "Birthday",
              type: "date",
            },
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
              {t.fields?.address || "Address"} *
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
              {t.fields?.idUpload || "ID Upload"} *
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
                <p className="text-sm text-gray-500">
                  {t.fields?.idPreview || "ID Preview"}:
                </p>
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
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading
            ? t.buttons?.submitting || "Submitting..."
            : `${t.submitOrder || "Submit Order"} ${formatPrice(form.price)}`}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
