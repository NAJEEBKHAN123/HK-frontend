// components/ContactInfo.js
import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const ContactInfo = ({
  translations,
  currentTime,
  isOfficeOpen,
  officeStatus,
  setActiveTab,
  whatsappUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* Call Us Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-lg shadow-sm">
            <FiPhone className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {translations.callUs.title}
            </h2>
            <p className="mt-1 text-gray-500 text-sm">
              {translations.callUs.description}
            </p>

            <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  {translations.officeHours}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {translations.parisTime}
                </span>
              </div>

              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {translations.currentTime}
                </p>
                <div className="flex items-center">
                  <FiClock className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900">
                    {currentTime.toLocaleString("en-GB", {
                      timeZone: "Europe/Paris",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <span className="mx-2 text-gray-300">•</span>
                  <p className="text-gray-600">
                    {currentTime.toLocaleString("en-GB", {
                      timeZone: "Europe/Paris",
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {translations.status}
                </p>
                <div className="flex items-center">
                  <div
                    className={`h-3 w-3 rounded-full mr-2 bg-${officeStatus.color}-400`}
                  ></div>
                  <p className={`font-semibold text-${officeStatus.color}-600`}>
                    {officeStatus.status}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {translations.availability}
                </p>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {isOfficeOpen ? (
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    {officeStatus.next}
                  </p>
                </div>
              </div>
            </div>

            <a
              href="tel:+33630258982"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 transition-all duration-150"
            >
              {translations.callButton}
              <FiArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* WhatsApp Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
      >
        <div className=" flex items-start">
          <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
            <FaWhatsapp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4  flex-1">
            <h2 className="text-lg font-medium text-gray-900">
              {translations.whatsapp.title}
            </h2>
            <p className="mt-1 text-gray-500 text-sm">
              {translations.whatsapp.description}
            </p>
            <div className="flex text-center mt-4">
              <button className="flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200">
                <FaWhatsapp className="h-5 w-5 text-green-600" />

                <a href={whatsappUrl}>
                  <span className="ml-2 text-sm font-medium">
                    {translations.whatsapp.qrButton}
                  </span>
                </a>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Office Location Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
            <FiMapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-medium text-gray-900">
              {translations.officeLocation.title}
            </h2>
            <address className="mt-1 text-gray-500 text-sm not-italic">
              {translations.officeLocation.address1}
              <br />
              {translations.officeLocation.address2}
              <br />
              HONG KONG
            </address>

            <a
              href="https://www.google.com/maps/place/Hankow+Centre,+5-15+Hankow+Rd,+Tsim+Sha+Tsui,+Hong+Kong/@22.2985503,114.1715823,17z/data=!3m1!4b1!4m6!3m5!1s0x340400c7a3b41e3d:0x7e9a9a8f0a1a1a1a!8m2!3d22.2985503!4d114.1741572!16s%2Fg%2F11c1z3c9_f?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {translations.viewOnMap} <FiArrowRight className="ml-1" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
