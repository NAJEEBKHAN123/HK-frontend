import React, { useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircleIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

function HeroSec() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const translations = language === "fr" ? frTranslations.hero : enTranslations.hero;

  React.useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.3 },
    },
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      const bookingSection = document.getElementById("booking-section");
      if (bookingSection) {
        const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
        const sectionPosition = bookingSection.offsetTop - navbarHeight;
        window.scrollTo({
          top: sectionPosition,
          behavior: "smooth",
        });
        window.history.replaceState(null, "", "/#booking-section");
      }
    } else {
      navigate("/", {
        state: { scrollToBooking: true },
      });
    }
  };

  return (
    <div className="relative pt-12 pb-16 w-full overflow-hidden bg-gray-900">
      {/* Background with WhoWeAre-style animation */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1714102984753-c1930a6897ae?q=80&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/20" />
      </motion.div>

      {/* Content container - matches WhoWeAre padding exactly */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative max-w-7xl mx-auto h-full flex items-center px-5 lg:px-20  xl:px-20 sm:px-6"
      >
        <div className="w-full text-left text-white space-y-6 lg:space-y-8">
          {/* Tagline & Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
           <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white rounded-full mb-3 lg:mb-3 sm:mb-6 shadow-lg">
              {translations.tagline}
            </span>
            <h1 className="max-w-[800px] text-2xl md:text-5xl lg:text-5xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-snug sm:leading-[2.5rem] md:leading-[3rem] lg:leading-[3.8rem]">
              {translations.title_part1}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                {translations.title_part2}
              </span>,{" "}
              {translations.title_part3}
            </h1>
          </motion.div>

          {/* Benefits List - matches WhoWeAre grid pattern */}
          <motion.ul
            variants={containerVariants}
            className="max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 text-base sm:text-lg"
          >
            {translations.benefits.map((benefit, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3 p-2 bg-gray-900/30 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-blue-400/50 transition-all"
              >
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA Section - matches WhoWeAre button styling */}
          <motion.div
            variants={itemVariants}
            className="pt-4 lg:pt-4  space-y-4 max-w-3xl"
          >
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {translations.description}
            </p>
            <motion.div className="flex flex-col sm:flex-row pt-4 gap-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                onClick={handleBookClick}
                className="px-2 md:px-4 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl text-lg"
              >
                <CalendarIcon className="inline w-5 h-5 mr-2 -mt-1" />
                {translations.cta_button}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSec;