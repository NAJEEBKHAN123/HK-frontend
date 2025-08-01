import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import lionIcon from "../assets/siteLogo.png";
import { LanguageContext } from "../context/LanguageContext.jsx";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import BookingSection from "./BookingSection.jsx";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [langTimeout, setLangTimeout] = useState(null);
  const [servicesTimeout, setServicesTimeout] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage } = useContext(LanguageContext);

  const translations =
    language === "fr" ? frTranslations.navbar : enTranslations.navbar;

  // Service sub-items
  const serviceItems = [
    { path: "services", label: "all_services" },
    { path: "pricingCards", label: "pricing" },
    { path: "serviceCards", label: "service_cards" },
  ];

  // Active link detection
  const isActive = (path) => {
    if (path === "") return false;
    return (
      location.pathname === `/${path}` ||
      (path !== "" && location.pathname.includes(path))
    );
  };

  const dropdownWidth = language === 'fr' ? 'w-[130px]' : 'w-[170px]';
  const dropdownClasses = `absolute top-full left-0 mt-2 ${dropdownWidth} bg-gray-800 rounded-md shadow-lg py-1 z-50`;

  const navLinkClass = (path) => `
    hover:text-white
    transition-all
    duration-400
    ease-in-out
    hover:decoration-pink-500
    hover:underline
    transition-colors 
    ${isActive(path) ? "text-gray-300" : "text-gray-100"}
    text-sm xl:text-base
  `;

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    closeAllMenus();
  };

 const handleBookingClick = (e) => {
  e.preventDefault();
  setIsBookingModalOpen(true);
  closeAllMenus();
};

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsLangOpen(false);
    if (isMenuOpen) closeAllMenus();
  };

  const handleMobileLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsMobileLangOpen(false);
    closeAllMenus();
  };

  // Hidden SEO content
  const seoContent = {
    fr: `
      Créer entreprise Hong Kong avec société offshore et création entreprise simplifiée. 
      Profitez des avantages fiscaux, zéro impôt sur revenus étrangers et régime fiscal avantageux. 
      Notre business hub en Asie offre services en ligne pour immatriculation société, 
      Hong Kong incorporation et online business registration. Solutions pour firme multinationale, 
      entreprise internationale et start-up Asie. Expert en entreprendre Hong Kong avec fiscalité favorable, 
      comparaison Hong Kong vs Dubaï et incorporation rapide. Réduisez vos coûts avec nos réglementations simplifiées, 
      optimisez votre Hong Kong taxation. Créer SARL Hong Kong, enregistrement entreprise avec structure sociétaire optimale. 
      Résidence fiscale avantageuse dans ce paradise fiscal avec compliance Hong Kong parfaite. 
      Business expansion Asie pour global entrepreneur avec business consulting expert. 
      Formation entreprise pour conquérir l'international market avec low cost incorporation. 
      Développez votre entreprise digitale, entreprise en ligne avec nos services fiscaux. 
      Consultant entreprise spécialisé en incorporation services et fiscalité Hong Kong. 
      Bénéficiez de fiscal advantages dans notre business community du financial hub Asia. 
      Domiciliation entreprise avec business registration simplifié pour multinational company. 
      Juridiction tax-friendly pour entreprise prospère et business growth durable. 
      Agilité (entreprise agilité) avec cloud business solutions pour entreprise compétitive. 
      Optimisation fiscale (tax avoidance legal) pour cross-border business. 
      Accompagnement pour entreprenariat étranger dans le Hong Kong marketplace. 
      Maximisez votre business efficiency pour entreprise rentable en strategic location Asia. 
      Expertise en fiscalité business et entreprise sécurité dans l'Asian economy dynamique. 
      Innovation (entreprise innovation) avec tax reduction strategies et legal business structure. 
      Accélérez votre digital transformation pour international business setup réussi. 
      Accédez à notre portail entreprise numérique pour entreprise connectée.
    `,
    en: `
      Build a business in Hong Kong with offshore company and streamlined company formation. 
      Enjoy tax advantages, zero tax on foreign income and beneficial tax regime. 
      Our Asia business hub offers online services for company registration, 
      Hong Kong incorporation and online business registration. Solutions for multinational firm, 
      international business and Asia start-up. Expert in doing business in Hong Kong with favorable taxation, 
      Hong Kong vs Dubai comparison and fast incorporation. Reduce costs with our simplified regulations, 
      optimize your Hong Kong taxation. Create LLC in Hong Kong, business registration with optimal corporate structure. 
      Advantageous tax residence in this tax haven with perfect Hong Kong compliance. 
      Business expansion in Asia for global entrepreneur with expert business consulting. 
      Company formation to conquer international market with low cost incorporation. 
      Develop your digital business, online business with our tax services. 
      Business consultant specialized in incorporation services and Hong Kong tax. 
      Benefit from fiscal advantages in our business community of financial hub Asia. 
      Business domiciliation with simplified business registration for multinational company. 
      Tax-friendly jurisdiction for successful business and sustainable business growth. 
      Agility (business agility) with cloud business solutions for competitive business. 
      Tax optimization (legal tax avoidance) for cross-border business. 
      Support for foreign entrepreneurship in the Hong Kong marketplace. 
      Maximize your business efficiency for profitable business in strategic location Asia. 
      Expertise in business taxation and business security in the dynamic Asian economy. 
      Innovation (business innovation) with tax reduction strategies and legal business structure. 
      Accelerate your digital transformation for successful international business setup. 
      Access our digital business portal for connected business.
    `,
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      {/* Hidden SEO content */}
      <div className="hidden" aria-hidden="true">
        {seoContent[language]}
      </div>

      {/* Mobile Header (sm) */}
      <div className="xl1170:hidden flex justify-between items-center px-4 h-16">
        <div className="w-10 h-10 bg-gray-900 uppercase rotate-45 flex items-center justify-center">
          <Link
            to="/"
            onClick={handleHomeClick}
            aria-label={language === "fr" ? "Accueil" : "Home"}
          >
            <img
              src={lionIcon}
              alt={language === "fr" ? "Logo" : "Logo"}
              className="w-9 h-9 -rotate-45 object-contain bg-white rounded-full border-2"
              loading="eager"
            />
          </Link>
        </div>

        <button
          onClick={handleBookingClick}
          className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-3 py-1 rounded text-sm hover:from-pink-700 hover:to-pink-600 transition-colors shadow-md"
          aria-label={translations.book_appointment}
        >
          {translations.book_appointment}
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
          aria-label={language === "fr" ? "Menu" : "Menu"}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Nav (lg+) */}
      <div className="hidden xl1170:flex justify-between items-center h-[90px] px-6 lg:px-20">
        {/* Left Nav - Updated with Services Dropdown */}
        <div className={`flex ${language === "fr" ? "gap-5" : "gap-9"}`}>
          {["home", "who_we_are", "contact"].map((item) => {
            const path = item === "home" ? "" : item.replace(/_/g, "-");
            return (
              <Link
                key={item}
                to={`/${path}`}
                className={navLinkClass(path)}
                aria-label={translations[item]}
                onClick={handleHomeClick}
              >
                {translations[item]}
              </Link>
            );
          })}

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(servicesTimeout);
              setIsServicesOpen(true);
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => setIsServicesOpen(false), 200);
              setServicesTimeout(timeout);
            }}
          >
            <button
              className={`${navLinkClass("services")} flex items-center gap-1`}
              aria-expanded={isServicesOpen}
              aria-haspopup="true"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              {translations.services}
              <svg
                className={`w-4 h-4 transition-transform ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isServicesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={dropdownClasses}
                onMouseEnter={() => {
                  clearTimeout(servicesTimeout);
                  setIsServicesOpen(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(
                    () => setIsServicesOpen(false),
                    200
                  );
                  setServicesTimeout(timeout);
                }}
              >
                {serviceItems.map((service) => (
                  <Link
                    key={service.path}
                    to={`/${service.path}`}
                    className={`block px-4 py-3 text-sm hover:bg-gray-700 transition-colors ${
                      isActive(service.path) ? "text-pink-400" : "text-gray-200"
                    }`}
                    onClick={closeAllMenus}
                  >
                    {translations[service.label]}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Nav */}
        <div
          className={`flex ${
            language === "fr" ? "gap-3" : "gap-7"
          } items-center`}
        >
          <Link
            to="/faq"
            className={navLinkClass("faq")}
            aria-label={translations.faq}
          >
            {translations.faq}
          </Link>

          <button
            onClick={handleBookingClick}
            className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-4 xl:px-4 py-1.5 rounded hover:from-pink-700 hover:to-pink-600 transition-colors shadow-md hover:shadow-lg text-sm xl:text-base"
            aria-label={translations.book_appointment}
          >
            {translations.book_appointment}
          </button>

          {/* Language Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => {
              if (langTimeout) clearTimeout(langTimeout);
              setIsLangOpen(true);
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => setIsLangOpen(false), 200);
              setLangTimeout(timeout);
            }}
            onFocus={() => setIsLangOpen(true)}
            onBlur={() => setTimeout(() => setIsLangOpen(false), 100)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors ${
                isLangOpen ? "bg-gray-800/50" : ""
              }`}
              aria-haspopup="true"
              aria-expanded={isLangOpen}
              aria-label={translations.language_selector || "Language selector"}
            >
              <div className="flex items-center">
                <ReactCountryFlag
                  countryCode={language === "en" ? "GB" : "FR"}
                  svg
                  style={{
                    width: "1.1em",
                    height: "1.1em",
                    borderRadius: "2px",
                    objectFit: "cover",
                  }}
                />
                <span className="ml-2 text-sm font-medium">
                  {language === "en" ? "EN" : "FR"}
                </span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isLangOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isLangOpen && (
              <div
                className="absolute right-0 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-lg z-50 min-w-[140px] border border-gray-200 dark:border-gray-700 overflow-hidden"
                role="menu"
              >
                {["en", "fr"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`flex items-center w-full px-4 py-2.5 text-left transition-colors ${
                      language === lang
                        ? "bg-pink-50 dark:bg-gray-700 text-pink-600 dark:text-pink-400 font-medium"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/70"
                    }`}
                    role="menuitem"
                    aria-current={language === lang ? "true" : "false"}
                  >
                    <ReactCountryFlag
                      countryCode={lang === "en" ? "GB" : "FR"}
                      svg
                      style={{
                        width: "1.1em",
                        height: "1.1em",
                        borderRadius: "2px",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-sm">
                      {translations.language_options[lang]}
                    </span>
                    {language === lang && (
                      <svg
                        className="w-4 h-4 ml-auto text-pink-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Logo (xl+) */}
      <div className="hidden xl1170:block absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div itemScope itemType="https://schema.org/ProfessionalService">
          <div className="w-[90px] h-[90px] bg-gray-900 rotate-45 flex items-center justify-center shadow-xl">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="w-full h-full flex items-center justify-center"
              aria-label={language === "fr" ? "Accueil" : "Home"}
            >
              <motion.div className="relative -rotate-45">
                <motion.img
                  src={lionIcon}
                  alt={language === "fr" ? "Logo" : "Logo"}
                  className="w-14 h-14 object-contain bg-white p-1 rounded-full relative z-10"
                  initial={{ scale: 1 }}
                  whileHover={{
                    rotate: [0, -8, 6, -4, 0],
                    scale: [1, 1.05, 1.03, 1.05],
                    filter: [
                      "drop-shadow(0 0 0px rgba(212, 193, 111, 0))",
                      "drop-shadow(0 0 8px rgba(212, 193, 111, 0.8))",
                      "drop-shadow(0 0 12px rgba(212, 193, 111, 0.6))",
                    ],
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full -rotate-45 border-2 border-transparent"
                  whileHover={{
                    borderColor: [
                      "rgba(212, 193, 111, 0)",
                      "rgba(212, 193, 111, 0.7)",
                      "rgba(212, 193, 111, 0.3)",
                      "rgba(212, 193, 111, 0.7)",
                    ],
                    scale: 1.1,
                    transition: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full -rotate-45 bg-[rgba(212,193,111,0.1)] z-0"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileHover={{
                    scale: 1.15,
                    opacity: [0, 0.4, 0],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    },
                  }}
                />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu (sm) */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full xl:hidden bg-white text-gray-900 w-64 py-4 px-6 shadow-inner animate-slideDown z-50">
          <div className="flex flex-col space-y-4">
            {["", "who_we_are", "contact", "faq"].map((item) => {
              const path = item === "" ? "home" : item;
              return (
                <Link
                  key={item || "home"}
                  to={`/${item === "home" ? "" : item.replace(/_/g, "-")}`}
                  onClick={
                    item === ""
                      ? () => {
                          closeAllMenus();
                          handleHomeClick();
                        }
                      : closeAllMenus
                  }
                  className={`py-2 transition-colors border-b border-gray-300 ${
                    isActive(item)
                      ? "text-pink-500 font-medium"
                      : "hover:text-pink-500"
                  }`}
                  aria-label={translations[path]}
                >
                  {translations[path]}
                </Link>
              );
            })}

            {/* Mobile Services Dropdown */}
            <div className="border-b border-gray-300 pb-2">
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className={`w-full text-left py-2 flex justify-between items-center ${
                  isActive("services") ? "text-pink-500 font-medium" : ""
                }`}
              >
                {translations.services}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMobileServicesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMobileServicesOpen && (
                <div className="pl-4 mt-2 space-y-3">
                  {serviceItems.map((service) => (
                    <Link
                      key={service.path}
                      to={`/${service.path}`}
                      onClick={closeAllMenus}
                      className={`block py-1.5 text-sm ${
                        isActive(service.path)
                          ? "text-pink-500 font-medium"
                          : "hover:text-pink-500"
                      }`}
                    >
                      {translations[service.label]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 w-full p-4 pt-6">
              <a
                href="https://www.linkedin.com/in/ouvrir-societehk/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition transform hover:-translate-y-1"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61578182555199"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition transform hover:-translate-y-1"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/ouvrirsocietehk?igsh=MWoyZ21tdHZ6N2xrcA=="
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
                href="https://www.tiktok.com/@ouvrirsocietehk?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white transition transform hover:-translate-y-1"
              >
                <FaTiktok size={20} />
              </a>
            </div>

            {/* Mobile Language Selector */}
            <div className="pt-2">
              <div className="relative">
                <button
                  onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                  className="w-full bg-gray-100 text-gray-900 pl-3 pr-10 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left flex items-center"
                >
                  <ReactCountryFlag
                    countryCode={language === "en" ? "GB" : "FR"}
                    svg
                    style={{ width: "1em", height: "1em", marginRight: "8px" }}
                  />
                  {language === "en"
                    ? translations.language_options.en
                    : translations.language_options.fr}
                  <svg
                    className={`absolute right-3 w-4 h-4 transition-transform duration-300 ${
                      isMobileLangOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isMobileLangOpen && (
                  <div className="absolute mt-1 w-full bg-white text-gray-900 shadow-lg rounded-md z-50 border border-gray-200">
                    {["en", "fr"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleMobileLanguageChange(lang)}
                        className={`flex items-center px-4 py-2 w-full text-left transition-colors ${
                          language === lang
                            ? "bg-gray-100 text-pink-500 font-medium"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <ReactCountryFlag
                          countryCode={lang === "en" ? "GB" : "FR"}
                          svg
                          style={{
                            width: "1em",
                            height: "1em",
                            marginRight: "8px",
                          }}
                        />
                        {translations.language_options[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingSection
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;