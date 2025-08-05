import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiArrowRight,
  FiBriefcase,
  FiFileText,
  FiLayers,
  FiDollarSign,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { LanguageContext } from "../context/LanguageContext";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};



const ServicePricing = () => {
  const { language } = useContext(LanguageContext);
  const translations =
    language === "fr"
      ? frTranslations.priceServiceCard
      : enTranslations.priceServiceCard;

  const serviceColors = [
    "from-blue-100 to-blue-50",
    "from-purple-100 to-purple-50",
    "from-emerald-100 to-emerald-50",
    "from-amber-100 to-amber-50",
    "from-rose-100 to-rose-50",
    "from-indigo-100 to-indigo-50",
  ];

  const serviceIcons = [
    <FiBriefcase className="w-5 h-5" />,
    <FiFileText className="w-5 h-5" />,
    <FiLayers className="w-5 h-5" />,
    <FiDollarSign className="w-5 h-5" />,
    <FiCreditCard className="w-5 h-5" />,
    <FiUser className="w-5 h-5" />,
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-5 sm:px-6 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {translations.title.split(" ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {translations.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-3 max-w-2xl mx-auto text-xl text-gray-500"
          >
            {translations.subtitle}
          </motion.p>
        </motion.div>

        {/* Animated Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {translations.services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${serviceColors[index]}`}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Icon Header */}
                <motion.div
                
                  className="flex items-center mb-4"
                >
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {serviceIcons[index]}
                  </div>
                  <h3 className="ml-3 text-xl font-semibold  text-gray-900">
                    {service.title}
                  </h3>
                </motion.div>

                {/* Price with floating animation */}
                <motion.p
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-2xl font-bold text-gray-800 mb-4"
                >
                  {service.price}
                </motion.p>

                {/* Description */}
                <p className="text-gray-600 mb-6">{service.description}</p>

                {/* Features with staggered animation */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <FiCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button with arrow animation */}
                {/* CTA Button with arrow animation */}
                <Link
                  to="/contact"
                  className="mt-auto" // This ensures the link takes full width and maintains positioning
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#2563eb",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                  >
                    {translations.cta.getStarted}
                    <motion.span
                      animate={{
                        x: [0, 4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <FiArrowRight className="ml-2" />
                    </motion.span>
                  </motion.button>
                </Link>
              </div>

              {/* Floating dots decoration */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white opacity-10"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">{translations.cta.custom}</p>
          <Link to="/contact">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#1f2937",
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center text-lg font-bold px-8 py-3 border border-transparent rounded-xl shadow-sm text-white bg-gray-800"
            >
              {translations.cta.enterprise}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePricing;
