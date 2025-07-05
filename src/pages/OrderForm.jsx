import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

const OrderForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { language } = useContext(LanguageContext);
  
  // Get translations based on current language
  const t = language === 'fr' ? frTranslations.orderForm : enTranslations.orderForm;

  // Plan prices (unchanged)
  const planPrices = {
    'STARTER Pack': 3900,
    'TURNKEY Pack': 4600,
    'PREMIUM Pack': 9800
  };

  // Get plan/price from URL (unchanged)
  const planParam = queryParams.get("plan");
  const priceParam = queryParams.get("price");
  const validPlans = Object.keys(planPrices);
  const plan = validPlans.includes(planParam) ? planParam : 'STARTER Pack';
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
  const [success, setSuccess] = useState(false);

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

    try {
      // Validation with translated error messages
      const validationErrors = [];
      if (!form.fullName?.trim()) validationErrors.push(t.errors.fullName);
      if (!form.email?.trim()) validationErrors.push(t.errors.email);
      if (!form.phone?.trim()) validationErrors.push(t.errors.phone);
      if (!form.birthday) validationErrors.push(t.errors.birthday);
      if (!form.address?.trim()) validationErrors.push(t.errors.address);
      if (!form.idFile) validationErrors.push(t.errors.idFile);

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Upload ID to Cloudinary (unchanged)
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", form.idFile);
      cloudinaryForm.append("upload_preset", "id_uploads");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dockii7o6/image/upload",
        cloudinaryForm
      );

      // Create order payload
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        birthday: new Date(form.birthday).toISOString(),
        address: form.address.trim(),
        idImage: cloudinaryRes.data.secure_url,
        plan: form.plan,
        price: form.price,
        currency: "eur",
        status: "Pending Payment Instructions"
      };

      await axios.post("http://localhost:3000/api/orders", payload);
      setSuccess(true);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Price formatter (unchanged)
  const formatPrice = (amount) => {
    return `€${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 py-20">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5 text-center">
          <h2 className="text-2xl font-bold text-green-600">{t.success.title}</h2>
          <p className="text-lg">
            {t.success.message.replace('{plan}', form.plan)}
          </p>
          <p>
            {t.success.total}: <strong>{formatPrice(form.price)}</strong>
          </p>
          <div className="pt-4">
            <p className="text-gray-600">
              {t.success.contact
                .replace('{email}', form.email)
                .replace('{phone}', form.phone)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 sm:px-6 py-20">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">{t.title}</h2>

        <div className="text-center">
          <p className="text-gray-600">
            {t.planLabel}: <span className="font-semibold text-yellow-600">{form.plan}</span>
          </p>
          <p className="text-lg font-medium text-black mt-1">
            {t.totalLabel}: {formatPrice(form.price)}
          </p>
        </div>

        {/* Form Fields */}
        {[
          { name: "fullName", label: t.fields.fullName, type: "text" },
          { name: "email", label: t.fields.email, type: "email" },
          { name: "phone", label: t.fields.phone, type: "tel" },
          { name: "birthday", label: t.fields.birthday, type: "date" }
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
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? t.buttons.submitting : t.buttons.submit}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;