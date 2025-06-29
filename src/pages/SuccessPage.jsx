// pages/SuccessPage.jsx
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-6">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-extrabold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-700 text-lg">
          Thank you for your purchase!
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Your Order ID:
          <span className="block mt-1 font-mono text-sm text-green-800 bg-green-100 rounded p-2">
            {orderId}
          </span>
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition duration-300"
        >
          Go to Homepage
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
