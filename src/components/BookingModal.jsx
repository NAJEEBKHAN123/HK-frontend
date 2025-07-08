import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BookingSection = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState("30min");
  const [showCalendly, setShowCalendly] = useState(false);
  const calendlyRef = useRef(null);

  useEffect(() => {
    // Load Calendly immediately but keep it hidden
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowCalendly(true);
    }, 800); // Reduced from 1000ms to 800ms

    return () => clearTimeout(timer);
  }, [activeTab]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section
      id={id}
      className="relative py-28 min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 flex items-center overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Premium decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-300/20 via-transparent to-transparent"></div>
        </div>

        <motion.div
          initial={{ x: -100, y: -100, rotate: 0 }}
          animate={{ x: [0, 80, 0], y: [0, 80, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100/30 to-purple-100/30 blur-[100px]"
        />
        <motion.div
          initial={{ x: 100, y: 100, rotate: 10 }}
          animate={{ x: [0, -80, 0], y: [0, -80, 0], rotate: [10, -5, 10] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-violet-100/30 to-blue-100/30 blur-[100px]"
        />
        <motion.div
          initial={{ x: -50, y: 50, scale: 1 }}
          animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.05, 1] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-100/20 to-cyan-100/20 blur-[80px]"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-5 md:px-5  sm:px-5 lg:px-20 relative z-10">
        {/* Luxurious header section */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
          className="text-center mb-20"
        >
          <motion.div variants={variants} className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-indigo-600 shadow-sm border border-indigo-100/50">
              <svg
                className="w-5 h-5 mr-2 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Exclusive Scheduling
            </span>
          </motion.div>
          <motion.h2
            variants={variants}
            className="text-5xl md:text-6xl font-light text-slate-900 mb-6 tracking-tight"
          >
            Reserve Your{" "}
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Private Session
            </span>
          </motion.h2>
          <motion.div variants={variants} className="flex justify-center">
            <div className="w-40 h-1 bg-gradient-to-r from-indigo-300/0 via-indigo-400 to-indigo-300/0 rounded-full mb-8" />
          </motion.div>
          <motion.p
            variants={variants}
            className="text-xl text-slate-600/90 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Select from our curated availability for a personalized consultation
            experience.
          </motion.p>
        </motion.div>

        {/* Premium booking container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-[2rem]  shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm relative z-20"
          style={{
            boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.15)",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
          }}
        >
          {/* Premium consultation header */}
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
                  Schedule Your Consultation
                </h3>
                <p className="text-indigo-600/90 mt-2 font-light">
                  Choose your preferred session type
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
                  >
                    30-min Discovery
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar container with premium loading state */}
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
                    Preparing your booking experience...
                  </p>
                  <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                      }}
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
                {/* Optimized Calendly integration */}
                <div
                  id="calendly-inline-widget"
                  ref={calendlyRef}
                  className="relative w-full max-w-7xl mx-auto h-[950px] lg:h-[750px] overflow-hidden z-30"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(249,250,251,0.8) 0%, rgba(255,255,255,0.9) 100%)",
                    isolation: "isolate",
                    display: showCalendly ? "block" : "none",
                  }}
                >
                  <iframe
                    src="https://calendly.com/najeebkhanlaku/free-consultant?timezone=Europe/Paris"
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    frameBorder="0"
                  title="Booking Calendar"
                    
                  />
                </div>

                {/* Show loading state until Calendly is fully ready */}
                {!showCalendly && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                )}

                {/* Premium hover indicator */}
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
                        Real-Time Availability
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Premium footer section */}
          <div
            className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 px-10 py-8 border-t border-indigo-100/30"
            style={{ position: "relative", zIndex: 20 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="flex items-center space-x-5">
                <div className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200/50">
                  <svg
                    className="w-6 h-6 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    End-to-End Encrypted
                  </p>
                  <p className="text-xs text-slate-500/80 font-light">
                    Your privacy is our priority
                  </p>
                </div>
              </div>
              <motion.a
                href="/contact"
                className="relative px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Request Custom Arrangement
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Premium trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20"
        >
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-5 bg-white/80 backdrop-blur-sm text-sm font-medium text-slate-500 rounded-full border border-slate-200/50 shadow-sm">
                Trusted by elite professionals at
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 md:grid-cols-6">
            {/* Trust indicators content */}
          </div>
        </motion.div>
      </div>

      {/* Premium decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-indigo-200/50 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-violet-200/50 rounded-br-3xl"></div>
    </section>
  );
};

export default BookingSection;
