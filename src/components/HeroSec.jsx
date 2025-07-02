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

  const translations =
    language === "fr" ? frTranslations.hero : enTranslations.hero;

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
    <div className="relative pt-12 pb-20 w-full overflow-hidden bg-gray-900">
      {/* Enhanced Background Image */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1714102984753-c1930a6897ae?q=80&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Lighter Gradient Overlay */}
        <div className="absolute   inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/20" />
      </motion.div>

      {/* Content */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative h-full flex items-center px-4 sm:px-6 lg:px-4"
      >
        <div className="max-w-5xl  w-full text-left text-white space-y-4 sm:space-y-6 px-4 mt-[-12px] sm:px-6 lg:pl-24">
          {/* Tagline & Heading */}
          <motion.div variants={itemVariants} className="w-full">
            <span className="inline-block ml-[-3px]  mt-0  sm:mt-6 bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white rounded-full mb-3 lg:mb-8 sm:mb-6 shadow-lg">
              {translations.tagline}
            </span>
            <h1 className="max-w-[800px]   text-2xl pb-6 xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-8 sm:leading-[3.2rem] md:leading-[3.6rem]">
              {translations.title_part1}{" "}
              <span className="text-blue-300">{translations.title_part2}</span>,{" "}
              {translations.title_part3}
            </h1>
          </motion.div>

          {/* Benefits List */}
          <motion.ul
            variants={containerVariants}
            className="grid grid-cols-1  sm:grid-cols-2 gap-4 sm:gap-4 text-sm sm:text-base md:text-lg"
          >
            {translations.benefits.map((benefit, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3 sm:p-3 p-2 md:p-1 bg-gray-900/20 rounded-lg sm:rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blue-400 transition-all"
              >
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="space-y-3 sm:space-y-6 w-full sm:max-w-2xl pt-2"
          >
            <p className="text-sm pt-5 sm:text-base md:text-lg text-gray-200 leading-relaxed">
              {translations.description}
            </p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              onClick={handleBookClick}
              className="relative inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl group transition-all duration-300 shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></span>
              <span className="relative flex items-center">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {translations.cta_button}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSec;
