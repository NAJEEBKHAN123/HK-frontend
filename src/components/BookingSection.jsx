import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

const BookingSection = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState("30min");
  const [showCalendly, setShowCalendly] = useState(false);
  const calendlyRef = useRef(null);

  const { language } = useContext(LanguageContext);
  const translations =
    language === "fr" ? frTranslations.appointment : enTranslations.appointment;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowCalendly(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen && showCalendly) {
      setShowCalendly(false);
      const timer = setTimeout(() => setShowCalendly(true), 100);
      return () => clearTimeout(timer);
    }
  }, [language, isOpen]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm"
              style={{
                boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.15)",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 hover:bg-slate-100 transition-colors"
                aria-label={language === 'fr' ? "Fermer" : "Close"}
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Consultation header */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 px-10 py-8 border-b border-indigo-100/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-medium text-slate-800 flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {translations.booking.title}
                    </h3>
                    <p className="text-indigo-600/90 mt-2 font-light">
                      {translations.booking.subtitle}
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-0">
                    <div className="inline-flex rounded-full bg-white/90 backdrop-blur-sm p-1 shadow-sm border border-slate-200/50">
                      <button
                        onClick={() => setActiveTab("30min")}
                        className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                          activeTab === "30min"
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                            : "text-slate-600 hover:text-indigo-700 hover:bg-slate-100/50"
                        }`}
                        aria-label={language === 'fr' ? 
                          "Réserver une consultation de 30 minutes" : 
                          "Book 30 minute consultation"}
                      >
                        {translations.booking.options["30min"]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar container */}
              <div
                className="relative min-h-[750px] w-full"
                style={{ transform: "translateZ(0)" }}
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-16 h-16 mb-6"
                      >
                        <svg
                          className="w-full h-full text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </motion.div>
                      <p className="text-lg text-slate-500 font-medium mb-6">
                        {translations.loading.text}
                      </p>
                      <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="h-full bg-gradient-to-r from-indigo-300 to-violet-400 rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div
                    className="relative w-full h-full"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {/* Calendly integration */}
                    <div
                      id="calendly-inline-widget"
                      ref={calendlyRef}
                      className="relative w-full mx-auto h-[950px] lg:h-[750px] overflow-hidden z-30"
                      style={{
                        minWidth: "100%", 
                        maxWidth: "none",
                        background: "linear-gradient(to bottom, rgba(249,250,251,0.8) 0%, rgba(255,255,255,0.9) 100%)",
                        isolation: "isolate",
                        display: showCalendly ? "block" : "none",
                      }}
                    >
                      <div className="w-full h-full" style={{ minWidth: '1200px' }}>
                        <iframe
                          src="https://calendly.com/najeebkhanlaku/free-consultant?timezone=Europe/Paris"
                          width="100%"
                          height="100%"
                          className="absolute inset-0"
                          frameBorder="0"
                          title={language === 'fr' ? 
                            "Calendrier de réservation pour consultation Hong Kong" : 
                            "Booking calendar for Hong Kong consultation"}
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <AnimatePresence>
                      {isHovering && showCalendly && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-6 right-6 z-40"
                        >
                          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg text-sm font-medium text-indigo-600 border border-indigo-100/50 flex items-center">
                            <div className="w-2.5 h-2.5 mr-2 bg-green-400 rounded-full animate-pulse"></div>
                            {translations.status.realTime}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingSection;