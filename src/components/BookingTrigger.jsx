import React, { useState } from "react";
import { motion } from "framer-motion";
import BookingSection from "./BookingSection";

const BookingTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        // className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
      >

      </motion.button>

      <BookingSection 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default BookingTrigger;