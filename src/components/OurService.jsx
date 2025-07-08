import React, { useContext } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

const ServiceCard = ({ category, items, icon }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -5,
        transition: { 
          type: "spring",
          stiffness: 300
        } 
      }}
      className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 hover:border-blue-400/30 hover:shadow-xl h-full flex flex-col relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      
      <div className="p-6 flex-1 flex flex-col relative z-10">
        <div className="flex items-start min-h-[80px]">
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="text-3xl mr-4 mt-1 block text-blue-500"
          >
            {icon}
          </motion.span>
          <motion.h3 
            whileHover={{ x: 2 }}
            className="text-xl font-bold text-gray-800"
          >
            {category}
          </motion.h3>
        </div>
        
        <motion.hr 
          className="border-t border-gray-300/50 my-4 w-full"
          whileHover={{ width: "80%", opacity: 0.8 }}
        />
        
        <ul className="space-y-3 flex-1">
          {items.map((item, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start group-hover:translate-x-1 transition-transform"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default function OurServices() {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.services : enTranslations.services;
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    
    if (window.location.pathname === '/') {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
        const sectionPosition = bookingSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth'
        });
        
        window.history.replaceState(null, '', '/#booking-section');
      }
    } else {
      navigate('/', {
        state: { scrollToBooking: true }
      });
    }
  };

  return (
    <section id="services" className="relative py-28  lg:px-20 md:px-5 px-5 sm:px-5 bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      {/* Decorative elements matching WhoWeAre */}
      <div className="absolute inset-0 opacity-10 bg-[url('../assets/pattern.webp')] bg-[length:300px]" />
      <motion.div
        className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20 px-2"
        >
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-lg font-medium text-blue-600 mb-3 sm:mb-4 tracking-widest"
          >
            {translations.subtitle}
          </motion.p>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              {translations.title}
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="max-w-4xl mx-auto text-base sm:text-lg md:text-xl text-gray-600"
          >
            {translations.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {(translations?.serviceCategories || []).map((service, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="h-full"
            >
              <ServiceCard 
                category={service.category}
                items={service.items}
                icon={service.icon}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button 
            onClick={handleBookClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl text-lg"
          >
            {translations.ctaButton}
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-6 text-gray-600"
          >
            {translations.contactText}{' '}
            <Link 
              to="/contact" 
              className="text-blue-600 hover:underline font-medium"
            >
              {translations.contactLink}
            </Link>{' '}
            {translations.contactSuffix}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}