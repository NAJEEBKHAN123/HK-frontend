import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiBriefcase, FiFileText, FiLayers, FiDollarSign, FiCreditCard, FiUser } from 'react-icons/fi';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const hoverCard = {
  scale: 1.03,
  y: -5,
  transition: { 
    type: "spring",
    stiffness: 400,
    damping: 10
  }
};

const ServicePricing = () => {
  const services = [
    {
      icon: <FiBriefcase className="w-5 h-5" />,
      title: "Company Renewal",
      price: "USD1,000",
      description: "Annual company registration renewal",
      features: ["Document preparation", "Government submission", "Compliance check"],
      color: "from-blue-100 to-blue-50"
    },
    {
      icon: <FiFileText className="w-5 h-5" />,
      title: "Company Audit",
      price: "USD1,000-5,000",
      description: "Professional financial audit services",
      features: ["Balance sheet review", "Income statement audit", "Compliance verification"],
      color: "from-purple-100 to-purple-50"
    },
    {
      icon: <FiLayers className="w-5 h-5" />,
      title: "Apostille Service",
      price: "USD400 per apostille",
      description: "Document legalization for international use",
      features: ["Notarization", "State certification", "Embassy legalization"],
      color: "from-emerald-100 to-emerald-50"
    },
    {
      icon: <FiDollarSign className="w-5 h-5" />,
      title: "Company Liquidation",
      price: "USD2,000+",
      description: "Orderly dissolution of your business entity",
      features: ["Debt settlement", "Asset distribution", "Final tax filing"],
      color: "from-amber-100 to-amber-50"
    },
    {
      icon: <FiCreditCard className="w-5 h-5" />,
      title: "Bank Account Opening",
      price: "USD3,000",
      description: "Corporate account with international banks",
      features: ["Bank selection", "Document preparation", "Relationship management"],
      color: "from-rose-100 to-rose-50"
    },
    {
      icon: <FiUser className="w-5 h-5" />,
      title: "Nominee Services",
      price: "USD1,000",
      description: "Professional nominee director/shareholder",
      features: ["Annual service", "Complete discretion", "Contract agreement"],
      color: "from-indigo-100 to-indigo-50"
    }
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
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Business Services</span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-3 max-w-2xl mx-auto text-xl text-gray-500"
          >
            Tailored solutions for global entrepreneurs and corporations
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
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={hoverCard}
              className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${service.color}`}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Icon Header */}
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="flex items-center mb-4"
                >
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {service.icon}
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{service.title}</h3>
                </motion.div>

                {/* Price with floating animation */}
                <motion.p 
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
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
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#2563eb" // darker blue
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-auto w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                >
                  Get Started
                  <motion.span
                    animate={{
                      x: [0, 4, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <FiArrowRight className="ml-2" />
                  </motion.span>
                </motion.button>
              </div>
              
              {/* Floating dots decoration */}
              <motion.div 
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut"
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
          <p className="text-gray-600 mb-4">Need custom solutions?</p>
          <Link to='/contact'>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#1f2937" // darker gray
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center text-lg px-6 py-3 border border-transparent font-medium rounded-lg shadow-sm text-white bg-gray-800"
          >
            Contact Enterprise Team
          </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePricing;