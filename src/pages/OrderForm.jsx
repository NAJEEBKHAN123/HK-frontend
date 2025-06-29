import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const OrderForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Define plan prices in EUROS (whole numbers)
  const planPrices = {
    'STARTER Pack': 3900, // Will display as €3,900
    'TURNKEY Pack': 4600, // Will display as €4,600
    'PREMIUM Pack': 9800  // Will display as €9,800
  };

  // Get and validate plan from URL
  const planParam = queryParams.get("plan");
  const priceParam = queryParams.get("price");

  // Validate plan against allowed values
  const validPlans = Object.keys(planPrices);
  const plan = validPlans.includes(planParam) ? planParam : 'STARTER Pack';
  
  // Get price - use URL param if valid, otherwise fallback to plan price
  const price = priceParam && !isNaN(Number(priceParam)) 
    ? Number(priceParam) 
    : planPrices[plan] || 0;

  const [form, setForm] = useState({
    fullName: "",
    birthday: "",
    address: "",
    phone: "",
    email: "",
    idFile: null,
    plan: plan,
    price: price
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idFile") {
      setForm({ ...form, idFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo(null);

    try {
      // Validate all required fields
      const validationErrors = [];
      
      if (!form.fullName?.trim()) validationErrors.push("Full name is required");
      if (!form.email?.trim()) validationErrors.push("Email is required");
      if (!form.phone?.trim()) validationErrors.push("Phone number is required");
      if (!form.birthday) validationErrors.push("Birthday is required");
      if (!form.address?.trim()) validationErrors.push("Address is required");
      if (!form.idFile) validationErrors.push("ID file is required");
      if (!form.plan || !validPlans.includes(form.plan)) validationErrors.push("Valid plan is required");
      if (!form.price || isNaN(form.price) || form.price <= 0) validationErrors.push("Valid price is required");

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Upload to Cloudinary
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", form.idFile);
      cloudinaryForm.append("upload_preset", "id_uploads");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dockii7o6/image/upload",
        cloudinaryForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Prepare payload
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        birthday: new Date(form.birthday).toISOString(),
        address: form.address.trim(),
        idImage: cloudinaryRes.data.secure_url,
        plan: form.plan,
        price: form.price,
        currency: "eur"
      };

    //   console.log("Submitting order:", payload);

      // Send to backend
      const orderRes = await axios.post(
        "http://localhost:3000/api/orders",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderRes.data?.checkoutUrl) {
        throw new Error("Missing checkout URL from backend");
      }

      // Redirect to payment page
      window.location.href = orderRes.data.checkoutUrl;

    } catch (err) {
      console.error("Submission error:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack,
      });

      setError(err.response?.data?.message || err.message);
      setDebugInfo({
        message: err.message,
        response: err.response?.data,
        payload: form,
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom formatter with comma as thousand separator
  const formatPrice = (amount) => {
    return `€${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-7 sm:px-6  py-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Complete Your Order</h2>

        <div className="text-center">
          <p className="text-gray-600">
            You selected: <span className="font-semibold text-yellow-600">{form.plan}</span> plan
          </p>
          <p className="text-lg font-medium text-black mt-1">
            Total: {formatPrice(form.price)} 
          </p>
        </div>

        {/* Form Fields */}
        {["fullName", "email", "phone", "birthday"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field === "fullName"
                ? "Full Name"
                : field === "phone"
                ? "Phone Number"
                : field.charAt(0).toUpperCase() + field.slice(1)}{" "}
              *
            </label>
            <input
              type={
                field === "email"
                  ? "email"
                  : field === "phone"
                  ? "tel"
                  : field === "birthday"
                  ? "date"
                  : "text"
              }
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
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
            Upload ID (JPEG/PNG/PDF, max 5MB) *
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
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Processing..." : `Pay ${formatPrice(form.price)}`}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;