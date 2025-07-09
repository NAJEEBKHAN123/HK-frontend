import React, { useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircleIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { Link } from "react-router-dom";
import HeroImg from "../assets/HeroBackground.webp"

function HeroSec() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const translations = language === "fr" ? frTranslations.hero : enTranslations.hero;

  React.useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  // Optimized animations with reduced motion preference check
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] // Custom easing curve
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px -5px rgba(59, 130, 246, 0.3)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10
      },
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
    <div className="relative pt-[60px] pb-24 w-full overflow-hidden bg-gray-900">
      {/* Optimized background with reduced motion */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "linear"
        }}
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url(${HeroImg})`,
          backgroundPosition: "center 70%",
          top : "",
          backgroundSize: "cover",
          // backgroundPosition: "center",
          willChange: "transform", // Performance hint
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-gray-900/30" />
      </motion.div>

      {/* Content container */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative max-w-7xl mx-auto h-full flex items-center px-5 sm:px-8 lg:px-12 xl:px-16"
      >
        <div className="w-full text-left text-white space-y-6 lg:space-y-8">
          {/* Tagline & Heading */}
          <motion.div variants={itemVariants} className="space-y-5">
            <motion.span 
              variants={itemVariants}
              className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 text-xs lg:text-base font-medium text-white rounded-full shadow-md"
            >
              {translations.tagline}
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight sm:leading-[1.1]"
            >
              <span className="text-white">{translations.title_part1}</span>{' '}
              <span className="text-blue-400">{translations.title_part2}</span>,{' '}
              <span className="text-white">{translations.title_part3}</span>
            </motion.h1>
          </motion.div>

          {/* Benefits List */}
          <motion.ul
            variants={containerVariants}
            className="max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          >
            {translations.benefits.map((benefit, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3 p-3 sm:p-4 bg-gray-900/40 rounded-lg backdrop-blur-sm border border-gray-700/50 hover:border-blue-400/30 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-100 text-sm sm:text-base">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="pt-6 space-y-5 max-w-3xl"
          >
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 text-lg sm:text-xl leading-relaxed"
            >
              {translations.description}
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-4"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                onClick={handleBookClick}
                className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all text-base sm:text-lg"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                {translations.cta_button}
              </motion.button>
              
             <Link to='/services'>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg shadow transition-all text-base sm:text-lg"
              >
                {translations.secondary_cta || "Learn More"}
              </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSec;