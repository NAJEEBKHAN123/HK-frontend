import React, { useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircleIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { Link } from "react-router-dom";
import HeroImg from "../assets/HeroBackground.webp";
import { Helmet } from "react-helmet";

function HeroSec() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const translations = language === "fr" ? frTranslations.hero : enTranslations.hero;

  // SEO content for hero section
  const seoContent = {
    fr: `
      Création d'entreprise à Hong Kong - Services complets d'incorporation offshore avec avantages fiscaux.
      Immatriculation rapide de société, zéro impôt sur les revenus étrangers, et accompagnement expert pour
      votre business en Asie. Solution idéale pour entreprise internationale, start-up ou firme multinationale.
    `,
    en: `
      Hong Kong company formation - Complete offshore incorporation services with tax advantages.
      Fast business registration, zero tax on foreign income, and expert support for your Asia business.
      Ideal solution for international business, start-up or multinational firm.
    `
  };

  React.useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

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
        ease: [0.16, 1, 0.3, 1]
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
    <>
      <Helmet>
        <title>{translations.seoTitle || (language === 'fr' ? 
          "Créer Société Hong Kong | Services d'Incorporation Professionnels" : 
          "Hong Kong Company Formation | Professional Incorporation Services")}</title>
        
        <meta name="description" content={translations.seoDescription || (language === 'fr' ?
          "Services complets pour créer votre entreprise à Hong Kong avec avantages fiscaux. Incorporation rapide, compte bancaire et support expert." :
          "Complete services to form your Hong Kong company with tax benefits. Fast incorporation, bank account and expert support.")} />
        
        <meta name="keywords" content={language === 'fr' ?
          "créer société Hong Kong, incorporation rapide, société offshore, avantages fiscaux, business Hong Kong" :
          "Hong Kong company formation, fast incorporation, offshore company, tax advantages, business Hong Kong"} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={translations.seoTitle || (language === 'fr' ?
          "Expert en Création d'Entreprise à Hong Kong" :
          "Hong Kong Company Formation Expert")} />
        
        <meta property="og:description" content={translations.seoDescription || (language === 'fr' ?
          "Services complets pour créer votre société à Hong Kong avec tous les avantages fiscaux" :
          "Complete services to form your Hong Kong company with all tax benefits")} />
        
        <meta property="og:image" content={HeroImg} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={translations.seoTitle || (language === 'fr' ?
          "Création Société Hong Kong" :
          "Hong Kong Company Formation")} />
        
        {/* Schema.org markup for ProfessionalService */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": language === 'fr' ? "Création Société Hong Kong" : "Hong Kong Company Formation",
            "description": language === 'fr' ?
              "Services professionnels pour créer une entreprise à Hong Kong avec avantages fiscaux" :
              "Professional services to form a Hong Kong company with tax benefits",
            "url": window.location.href,
            "logo": "https://yourdomain.com/logo.png",
            "serviceType": "Company formation services",
            "areaServed": {
              "@type": "Country",
              "name": "Hong Kong"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": language === 'fr' ? "Services d'Incorporation" : "Incorporation Services",
              "itemListElement": translations.benefits.map((benefit, index) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": benefit
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <header className="relative pt-[60px] pb-24 w-full overflow-hidden bg-gray-900" itemScope itemType="https://schema.org/ProfessionalService">
        {/* Background with reduced motion */}
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
            backgroundSize: "cover",
            willChange: "transform",
          }}
          aria-hidden="true"
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
                itemProp="serviceType"
              >
                {translations.tagline}
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight sm:leading-[1.1]"
                itemProp="name"
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
              itemProp="hasOfferCatalog"
              itemScope
              itemType="https://schema.org/OfferCatalog"
            >
              {translations.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-3 sm:p-4 bg-gray-900/40 rounded-lg backdrop-blur-sm border border-gray-700/50 hover:border-blue-400/30 transition-colors"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <CheckCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100 text-sm sm:text-base" itemProp="name">
                    {benefit}
                  </span>
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
                itemProp="description"
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
                  aria-label={language === 'fr' ? 
                    "Prendre rendez-vous pour créer une société à Hong Kong" : 
                    "Book appointment for Hong Kong company formation"}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {translations.cta_button}
                </motion.button>
                
                <Link to='/services' itemProp="url">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg shadow transition-all text-base sm:text-lg"
                    aria-label={language === 'fr' ? 
                      "Voir nos services de création d'entreprise" : 
                      "View our company formation services"}
                  >
                    {translations.secondary_cta}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hidden SEO content */}
        <div className="hidden" aria-hidden="true" dangerouslySetInnerHTML={{ __html: seoContent[language] }} />
      </header>
    </>
  );
}

export default HeroSec;