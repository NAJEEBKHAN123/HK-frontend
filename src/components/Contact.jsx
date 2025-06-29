import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import QRCode from "react-qr-code";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { Helmet } from "react-helmet";

const ContactUs = () => {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.contact : enTranslations.contact;

  // SEO Configuration
  const seoConfig = {
    en: {
      title: "Contact Hong Kong Company Formation Experts | Get Started Today",
      description: "Speak with our specialists about Hong Kong company registration, offshore setup, and tax optimization. Fast response guaranteed.",
      keywords: "Hong Kong company contact, offshore business help, HK incorporation consultation",
      canonicalUrl: "https://yourdomain.com/en/contact",
      ogImage: "https://yourdomain.com/images/og-contact.jpg"
    },
    fr: {
      title: "Contactez nos Experts en Création d'Entreprise à Hong Kong",
      description: "Parlez avec nos spécialistes de l'enregistrement d'entreprise à Hong Kong et optimisation fiscale.",
      keywords: "contact création entreprise HK, aide société offshore",
      canonicalUrl: "https://yourdomain.com/fr/contact",
      ogImage: "https://yourdomain.com/images/og-contact-fr.jpg"
    }
  };
  const currentSeo = seoConfig[language];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  // Check office hours (9AM-5PM Paris Time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const parisTime = now.toLocaleString("en-US", {
        timeZone: "Europe/Paris",
        hour: 'numeric',
        hour12: false
      });
      const parisHour = parseInt(parisTime);
      
      const isWeekday = now.toLocaleString("en-US", { 
        timeZone: "Europe/Paris",
        weekday: 'short' 
      }).toLowerCase();
      const isWorkingDay = !['sat', 'sun'].includes(isWeekday);
      
      setIsOfficeOpen(isWorkingDay && parisHour >= 9 && parisHour < 17);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://yourdomain.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const whatsappUrl = `https://wa.me/85212345678?text=${encodeURIComponent(
    `Hi! I need help with HK company registration. My name is ${formData.name || 'there'}`
  )}`;

  const getOfficeStatusInfo = () => {
    const parisWeekday = currentTime.toLocaleString("en-US", { 
      timeZone: "Europe/Paris",
      weekday: 'long' 
    });
    const parisHour = currentTime.toLocaleString("en-US", {
      timeZone: "Europe/Paris",
      hour: 'numeric',
      hour12: false
    });
    
    if (isOfficeOpen) {
      return {
        status: translations.officeOpen || 'OPEN NOW',
        color: 'green',
        next: translations.closesToday || 'Closes today at 17:00'
      };
    } else {
      if (parisWeekday.toLowerCase() === 'saturday') {
        return {
          status: translations.officeClosed || 'CLOSED',
          color: 'red',
          next: translations.opensMonday || 'Opens Monday at 09:00'
        };
      } else if (parisWeekday.toLowerCase() === 'sunday') {
        return {
          status: translations.officeClosed || 'CLOSED',
          color: 'red',
          next: translations.opensMonday || 'Opens Monday at 09:00'
        };
      } else {
        return parseInt(parisHour) < 9 ? {
          status: translations.officeClosed || 'CLOSED',
          color: 'red',
          next: translations.opensToday || 'Opens today at 09:00'
        } : {
          status: translations.officeClosed || 'CLOSED',
          color: 'red',
          next: translations.opensTomorrow || 'Opens tomorrow at 09:00'
        };
      }
    }
  };

  const officeStatus = getOfficeStatusInfo();

  // Schema.org data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": currentSeo.title,
    "description": currentSeo.description,
    "url": currentSeo.canonicalUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+85212345678",
      "contactType": "customer service",
      "areaServed": ["Hong Kong", "Worldwide"],
      "availableLanguage": ["English", "French"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00",
        "timeZone": "Europe/Paris"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
        <meta name="keywords" content={currentSeo.keywords} />
        <link rel="canonical" href={currentSeo.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={currentSeo.title} />
        <meta property="og:description" content={currentSeo.description} />
        <meta property="og:url" content={currentSeo.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={currentSeo.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentSeo.title} />
        <meta name="twitter:description" content={currentSeo.description} />
        <meta name="twitter:image" content={currentSeo.ogImage} />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <section className="py-16 px-2 sm:px-6 lg:px-12 bg-gray-50" id="contact">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {translations.title}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              {translations.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 px-4 md:px-2 gap-8 xl:px-16">
            {/* Left Column: Contact Methods */}
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
                    <h2 className="text-lg font-semibold text-gray-900">{translations.callUs.title}</h2>
                    <p className="mt-1 text-gray-500 text-sm">
                      {translations.callUs.description}
                    </p>
                    
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{translations.officeHours}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {translations.parisTime}
                        </span>
                      </div>
                      
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{translations.currentTime}</p>
                        <div className="flex items-center">
                          <FiClock className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="font-medium text-gray-900">
                            {currentTime.toLocaleString("en-GB", {
                              timeZone: "Europe/Paris",
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </p>
                          <span className="mx-2 text-gray-300">•</span>
                          <p className="text-gray-600">
                            {currentTime.toLocaleString("en-GB", {
                              timeZone: "Europe/Paris",
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{translations.status}</p>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-2 bg-${officeStatus.color}-400`}></div>
                          <p className={`font-semibold text-${officeStatus.color}-600`}>
                            {officeStatus.status}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{translations.availability}</p>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            {isOfficeOpen ? (
                              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                      href="tel:+85212345678"
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
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                    <FaWhatsapp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-medium text-gray-900">
                      {translations.whatsapp.title}
                    </h2>
                    <p className="mt-1 text-gray-500 text-sm">
                      {translations.whatsapp.description}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => setActiveTab("whatsapp")}
                        className="flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200"
                      >
                        <FaWhatsapp className="h-5 w-5 text-green-600" />
                        <span className="ml-2 text-sm font-medium">{translations.whatsapp.qrButton}</span>
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
                      {translations.officeLocation.address1}<br />
                      {translations.officeLocation.address2}<br />
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

            {/* Right Column: Dynamic Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("form")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "form"
                        ? "border-cyan-500 text-cyan-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {translations.formTab}
                  </button>
                  <button
                    onClick={() => setActiveTab("whatsapp")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "whatsapp"
                        ? "border-cyan-500 text-cyan-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {translations.whatsappTab}
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {submitStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                          {translations.formSuccess}
                        </div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                          {translations.formError}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            {translations.formLabels.name} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            placeholder={translations.formPlaceholders.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            {translations.formLabels.email} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            placeholder={translations.formPlaceholders.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            {translations.formLabels.phone}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder={translations.formPlaceholders.phone}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            {translations.formLabels.message} <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={10}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={translations.formPlaceholders.message}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {translations.formSending}
                              </>
                            ) : (
                              translations.formSubmit
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "whatsapp" && (
                    <motion.div
                      key="whatsapp"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-center"
                    >
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        {translations.scanToChat}
                      </h2>
                      <p className="text-gray-500 mb-6">
                        {translations.whatsappResponseTime}
                      </p>
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <QRCode
                            value={whatsappUrl}
                            size={180}
                            fgColor="#25D366"
                            level="H"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {translations.preferManual}{" "}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600 hover:underline font-medium"
                        >
                          {translations.clickToOpenWhatsapp}
                        </a>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;