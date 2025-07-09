import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import lionIcon from "../assets/siteLogo.png";
import { LanguageContext } from "../context/LanguageContext.jsx";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [langTimeout, setLangTimeout] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage } = useContext(LanguageContext);

  const translations =
    language === "fr" ? frTranslations.navbar : enTranslations.navbar;

  const underlineClass =
    "relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-pink-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";

 // Hidden SEO content with all 70 keywords
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
  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToBookingSection();
    } else {
      navigate("/", { state: { scrollToBooking: true } });
    }
    closeMobileMenu();
  };

  const scrollToBookingSection = () => {
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
      const sectionPosition = bookingSection.offsetTop - navbarHeight;
      window.scrollTo({ top: sectionPosition, behavior: "smooth" });
      window.history.replaceState(null, "", "/#booking-section");
    }
  };

  useEffect(() => {
    if (location.state?.scrollToBooking || window.location.hash === "#booking-section") {
      setTimeout(scrollToBookingSection, 100);
    }
  }, [location]);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsLangOpen(false);
    if (isMenuOpen) closeMobileMenu();
  };

  const handleMobileLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsMobileLangOpen(false);
    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      {/* Hidden SEO content */}
      <div className="hidden" aria-hidden="true">
        {seoContent[language]}
      </div>

      {/* Mobile Header (sm) */}
      <div className="xl1170:hidden flex  justify-between items-center px-4 h-16">
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
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Nav (lg+) */}
      
      <div className="hidden xl1170:flex justify-between items-center h-[90px] px-6 lg:px-20 ">
        {/* Left Nav */}
        <div className={`flex ${language === 'fr' ? 'gap-5' : 'gap-9'}`}>
          {['home', 'services', 'who_we_are', 'contact' ].map((item) => (
            <Link
              key={item}
               to={`/${item === 'home' ? '' : item.replace(/_/g, '-')}`}
              className={`hover:text-white ${underlineClass} text-sm xl:text-base`}
              aria-label={translations[item]}
            >
              {translations[item]}
            </Link>
          ))}
        </div>

        {/* Right Nav */}
        <div className={`flex ${language === 'fr' ? 'gap-6' : 'gap-8'} items-center`}>
          <Link
            to="/faq"
            className={`hover:text-white ${underlineClass} text-sm xl:text-base`}
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
            className="relative"
            onMouseEnter={() => {
              if (langTimeout) clearTimeout(langTimeout);
              setIsLangOpen(true);
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => setIsLangOpen(false), 200);
              setLangTimeout(timeout);
            }}
          >
            <button
              className={`hover:text-white ${underlineClass} focus:outline-none flex items-center text-sm xl:text-base`}
              aria-haspopup="true"
              aria-expanded={isLangOpen}
            >
             FR | EN
              <svg
                className={`ml-1 w-4 h-4 transition-transform duration-300 ${isLangOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangOpen && (
              <div className="absolute mt-2 bg-white text-gray-900 shadow-lg rounded-md uppercase z-50 min-w-[120px] border border-gray-200">
                {['en', 'fr'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center px-4 py-2 w-full text-left transition-colors ${
                      language === lang ? "bg-gray-100 text-pink-500 font-medium" : "hover:bg-gray-50"
                    }`}
                  >
                    <ReactCountryFlag
                      countryCode={lang === "en" ? "GB" : "FR"}
                      svg
                      style={{ width: "1.2em", height: "1.2em", marginRight: "8px" }}
                    />
                    {translations.language_options[lang]}
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
                    transition: { duration: 1.2, repeat: Infinity, repeatType: "reverse" },
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full -rotate-45 bg-[rgba(212,193,111,0.1)] z-0"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileHover={{
                    scale: 1.15,
                    opacity: [0, 0.4, 0],
                    transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" },
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
            {['home', 'services', 'faq', 'who_we_are', 'contact'].map((item) => (
              <Link
                key={item}
                to={`/${item === 'home' ? '' : item.replace(/_/g, '-')}`}
                onClick={item === 'home' ? () => { closeMobileMenu(); handleHomeClick(); } : closeMobileMenu}
                className="py-2 hover:text-pink-500 transition-colors border-b border-gray-300"
                aria-label={translations[item]}
              >
                {translations[item]}
              </Link>
            ))}

            <div className="flex space-x-4 p-4 justify-center">
              {[
                { icon: <FaLinkedin size={20} />, color: "text-cyan-600" },
                { icon: <FaFacebook size={20} />, color: "text-blue-600" },
                { icon: <FaInstagram size={20} />, color: "text-pink-600" },
                { icon: <FaYoutube size={20} />, color: "text-red-600" },
                { icon: <FaTiktok size={20} />, color: "text-black" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:${social.color} transition transform hover:-translate-y-1`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

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
                  {language === "en" ? translations.language_options.en : translations.language_options.fr}
                  <svg
                    className={`absolute right-3 w-4 h-4 transition-transform duration-300 ${
                      isMobileLangOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMobileLangOpen && (
                  <div className="absolute mt-1 w-full bg-white text-gray-900 shadow-lg rounded-md z-50 border border-gray-200">
                    {['en', 'fr'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleMobileLanguageChange(lang)}
                        className={`flex items-center px-4 py-2 w-full text-left transition-colors ${
                          language === lang ? "bg-gray-100 text-pink-500 font-medium" : "hover:bg-gray-50"
                        }`}
                      >
                        <ReactCountryFlag
                          countryCode={lang === "en" ? "GB" : "FR"}
                          svg
                          style={{ width: "1em", height: "1em", marginRight: "8px" }}
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
    </nav>
  );
};

export default Navbar;