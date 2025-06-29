// pages/CancelPage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircleIcon } from "@heroicons/react/24/solid";

const CancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-white px-6 py-20">
      <motion.div
        className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-6">
          <XCircleIcon className="h-16 w-16 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-red-600 mb-3">
          Payment Cancelled ❌
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment was not completed. If this was a mistake, you can try again.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition duration-300"
        >
          Back to Order Page
        </Link>
      </motion.div>
    </div>
  );
};

export default CancelPage;
