import React, { useContext } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";



const ServiceCard = ({ category, items, icon }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ 
        y: -10,
        scale: 1.03,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 10
        } 
      }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-2xl h-full flex flex-col relative group"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
      
      <div className="pl-4 p-3 flex-1 flex flex-col relative z-10">
        <div className="flex items-start min-h-[80px]">
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="text-3xl mr-3 mt-1 block"
            aria-hidden="true"
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
          className="border-t border-gray-300 my-4 w-full"
          whileHover={{ width: "80%", opacity: 0.8 }}
        />
        
        <ul className="space-y-3 flex-1">
          {items.map((item, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="flex items-start group-hover:translate-x-1  transition-transform"
            >
              <motion.div whileHover={{ scale: 1.1 }}>
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1 ml-2 lg:ml-0 mr-3 flex-shrink-0" aria-hidden="true" />
              </motion.div>
              <span className="text-gray-600 group-hover:text-gray-800 px-2 lg:px-0 transition-colors">{item}</span>
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

  const navigate = useNavigate()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
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
    <section id="services" className="py-20 px-1 sm:px-3 lg:px-12 bg-gradient-to-b from-white to-gray-200">
      <div className="max-w-7xl xl:px-[0] lg:px-[55px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewpocrt={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.p 
            variants={itemVariants}
            className="text-blue-600 font-semibold mb-2"
          >
            {translations.subtitle}
          </motion.p>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            {translations.title}
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="mt-4 h-1.5 w-24 bg-blue-600 mx-auto rounded-full"
          ></motion.div>
        </motion.div>

    <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-5 px-4 sm:px-4 md:px-2 lg:px-2 xl:px-16"
          style={{ gridAutoRows: '1fr' }}
        >
          {(translations?.serviceCategories || []).map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard 
                category={service.category}
                items={service.items}
                icon={service.icon}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
         
           <button 
             onClick={handleBookClick}
            aria-label="Get started with our services"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {translations.ctaButton}
          </button>
       
          <p className="mt-4 text-gray-500">
            {translations.contactText} <a href="#contact" className="text-blue-600 hover:underline">
              <Link to='/contact'>
               {translations.contactLink}
              </Link>
              </a> {translations.contactSuffix}
          </p>
        </motion.div>
      </div>
    </section>
  );
}