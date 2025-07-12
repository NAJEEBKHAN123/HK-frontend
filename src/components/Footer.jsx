import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import {
  FiClock,
  FiMail,
  FiArrowUp,
  FiMapPin,
  FiPhoneCall,
} from "react-icons/fi";
import QRCode from "react-qr-code";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import CarbonStatic from "../pages/CarbonStatic";

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const translations =
    language === "fr" ? frTranslations.footer : enTranslations.footer;

  // State for dynamic elements
  const [isContactBarOpen, setIsContactBarOpen] = useState(true);
  const [currentTrustBadge, setCurrentTrustBadge] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState({
    hour: parseInt(
      new Date().toLocaleTimeString("en-US", {
        timeZone: "Europe/Paris",
        hour: "numeric",
        hour12: false,
      })
    ),
    day: new Date().toLocaleDateString("en-US", {
      timeZone: "Europe/Paris",
      weekday: "long",
    }),
  });
  const [isScrolled, setIsScrolled] = useState(false);

  // Trust badges from translations
  const trustBadges = translations.trustBadges;

  // Rotate trust badges every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrustBadge((prev) => (prev + 1) % trustBadges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trustBadges.length]);

  // Check office hours (Monday-Friday 9AM-5PM Paris Time)
  useEffect(() => {
    const timeInterval = setInterval(() => {
      const parisTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Europe/Paris",
        hour: "numeric",
        hour12: false,
      });
      const parisDay = new Date().toLocaleDateString("en-US", {
        timeZone: "Europe/Paris",
        weekday: "long",
      });
      setCurrentTime({
        hour: parseInt(parisTime),
        day: parisDay,
      });
    }, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // Scroll detection for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOfficeOpen =
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
      currentTime.day
    ) &&
    currentTime.hour >= 9 &&
    currentTime.hour < 17;

  // Dynamic CTA based on time (Paris office hours)
  const dynamicCTA = isOfficeOpen
    ? translations.speakToExpert
    : translations.scheduleConsultation;

  // WhatsApp URL
  const whatsappUrl = "https://wa.me/message/RFR3KU2NCMIKJ1";

  // Format address with line breaks
  const formattedAddress = translations.address.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <footer className="bg-gray-900 text-white relative z-10">
      {/* --- Sticky Contact Bar --- */}
      <AnimatePresence>
        {isContactBarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-800 to-indigo-900 px-4 py-3 relative z-20"
          >
            <div className="container mx-auto flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center space-x-3 min-w-[200px] flex-1">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm sm:text-base">
                  {isOnline
                    ? translations.contact.liveChat
                    : translations.contact.offline}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center flex-1">
               
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline hover:text-cyan-300 transition text-sm sm:text-base"
                >
                  <FaWhatsapp className="mr-2" />{" "}
                  {translations.contact.whatsapp}
                </a>
              </div>
              <button
                onClick={() => setIsContactBarOpen(false)}
                className="ml-auto md:ml-0 text-sm hover:bg-indigo-800 px-2 py-1 rounded transition"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Footer Content --- */}
      <div className="container mx-auto px-4 max-w-7xl py-8 md:py-12 relative z-10">
        {/* Trust Badge Carousel */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 md:mb-8 text-center border-l-4 border-cyan-400">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrustBadge}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="text-base md:text-lg font-medium"
            >
              <span className="mr-2 text-cyan-300">
                {trustBadges[currentTrustBadge].icon}
              </span>
              {trustBadges[currentTrustBadge].text}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-1 mb-8 md:mb-10">
          {/* Column 1: Brand + Social */}
          <div>
            <motion.h1
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            >
              {translations.companyName}
            </motion.h1>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              {translations.tagline}
            </p>

            {/* carbon website */}
            <CarbonStatic />
            <div className="flex flex-wrap gap-4 w-full p-4 pt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition transform hover:-translate-y-1"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition transform hover:-translate-y-1"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition transform hover:-translate-y-1"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition transform hover:-translate-y-1"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white transition transform hover:-translate-y-1"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>

           {/* Column 2: Contact */}
        
           <div className="">
            <h3 className="text-lg font-semibold sm:text-start mb-4  sm:mb-12 text-cyan-300">
              {translations.hkOffice}
            </h3>
            <ul className="space-y-5 text-gray-400 w-full flex flex-col ">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-2 text-cyan-300" />
                <span className="text md:text-base">{formattedAddress}</span>
              </li>
              <li className="flex items-start">
                <FiPhoneCall className="mt-1 mr-2 text-cyan-300" />
                <span className="text-sm md:text-base">+33 6 30 25 89 82</span>
              </li>
              <li className="flex items-start">
                <FiMail className="mt-1 mr-2 text-cyan-300" />
                <span className="text-sm md:text-base">
                  bonjour@ouvrir-societe-hong-kong.fr
                </span>
              </li>
              <li className="flex items-start">
                <FiClock className="mt-1 mr-2 text-cyan-300" />
                <span className="text-sm md:text-base">
                  {isOfficeOpen ? (
                    <span className="text-green-400">
                      {translations.openNow}
                    </span>
                  ) : (
                    <span>{translations.closed}</span>
                  )}
                </span>
              </li>
            </ul>
          </div>

        
           {/* Column 3: Quick Links */}
       
            <div className="legal-links">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">
              <Link
                to="/legal"
                className="hover:text-cyan-500 transition-colors duration-200"
              >
                {translations.Legals}
              </Link>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-1 gap-1">
              <li>
                <NavLink
                  to="/legal/privacy"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
             ${isActive ? "border-l-4 border-cyan-500 font-medium" : ""}
             hover:text-cyan-500`
                  }
                >
                  {translations.PrivacyStatement}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/legal/notices"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
             ${isActive ? "border-l-4 border-blue-500 font-medium" : ""}
             hover:text-blue-500`
                  }
                >
                  {translations.LegalNotices}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/legal/conditions"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
             ${isActive ? "border-l-4 border-emerald-500 font-medium" : ""}
             hover:text-emerald-500`
                  }
                >
                  {translations.GeneralConditions}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/legal/cookies"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
             ${isActive ? "border-l-4 border-amber-500 font-medium" : ""}
             hover:text-amber-500`
                  }
                >
                  {translations.CookiePolicy}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/legal/accessibility"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
             ${isActive ? "border-l-4 border-purple-500 font-medium" : ""}
             hover:text-purple-500`
                  }
                >
                  {translations.Accessibility}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/legal/choices"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg transition-all duration-200 text-sm md:text-base
             ${isActive ? "border-l-4 border-rose-500 font-medium" : ""}
             hover:text-rose-500`
                  }
                >
                  {translations.YourChoices}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Dynamic CTA + QR Code */}
          <div className="bg-gray-800 p-4 md:p-5 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-cyan-300">
              {translations.needHelp}
            </h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              {isOfficeOpen
                ? translations.availableNow
                : translations.bookCallback}
            </p>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium mb-4 transition-all transform hover:scale-[1.02] text-sm md:text-base">
              {dynamicCTA}
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white p-2 rounded">
                <QRCode value={whatsappUrl} size={80} fgColor="#0e7490" />
              </div>
              <p className="text-sm text-gray-400 text-center sm:text-left max-w-[180px]">
                {translations.scanToChat.replace(
                  "{platform}",
                  translations.wechatWhatsapp
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-6 md:pt-8 ">
          <div className="mx-auto">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
              {/* Left side - Copyright with dynamic year animation */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col  sm:flex-row items-center gap-2   text-center sm:text-left"
              >
                <span className="text-gray-400 text-xs sm:text-sm">
                  ©{" "}
                  <span className="font-medium text-cyan-300">
                    {new Date().getFullYear()}
                  </span>{" "}
                  {translations.companyName}
                </span>
                <span className="hidden sm:inline-block h-4 w-px bg-gray-600/50"></span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {translations.copyright}
                </span>
              </motion.div>

              {/* Right side - Admin with subtle animation */}
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex  xs:flex-row gap-6 items-center"
              >
                <Link
                  to="/admin/login"
                  className="group flex items-center gap-1.5 text-gray-400 hover:text-cyan-300 transition-colors text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:rotate-12 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                 <span className="hidden lg:inline-block">Admin Dashboard</span>
                 <span className="inline-block lg:hidden">Admin</span>
                </Link>

                <div className="group flex items-center bg-gray-100 hover:bg-gray-200/60 transition-colors duration-200 rounded-full px-3  lg:py-1 sm:px-4 py-1.5 sm:py-1.5 w-fit max-w-full">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                    {translations.Developedby}
                  </span>
                  <a
                    href="https://wa.me/923088440190"
                    className="flex items-center gap-1 group-hover:gap-1.5 transition-all duration-300 ml-1"
                    aria-label="Contact Najeeb Ullah via WhatsApp"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate max-w-[80px] xs:max-w-none">
                      Najeeb Ullah
                    </span>
                    <FaWhatsapp
                      className="flex-shrink-0 text-green-500 group-hover:text-green-600 transition-colors"
                      size={16}
                    />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Back to Top Button --- */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 z-[1000]"
            aria-label="Back to top"
          >
            <FiArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;