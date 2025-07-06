import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import axios from 'axios';

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
  const [submitError, setSubmitError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [validationErrors, setValidationErrors] = useState({});

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
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitError("");
    setValidationErrors({});

    try {
      const response = await axios.post('http://localhost:3000/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      
      if (error.response) {
        // Handle server validation errors
        if (error.response.data?.errors) {
          setValidationErrors(error.response.data.errors);
          setSubmitError('Please correct the errors below');
        } else {
          setSubmitError(error.response.data?.message || translations.formError);
        }
      } else if (error.request) {
        setSubmitError('Network error - please check your connection');
      } else {
        setSubmitError(translations.formError);
      }
      
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/85212345678?text=${encodeURIComponent(
    `New Contact Inquiry\n\nName: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message || 'No message provided'}`
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

  // Schema.org data (unchanged)
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

      <section className="py-16 px-1 sm:px-3 lg:px-12 bg-gray-50" id="contact">
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
            <ContactInfo 
              translations={translations}
              currentTime={currentTime}
              isOfficeOpen={isOfficeOpen}
              officeStatus={officeStatus}
              setActiveTab={setActiveTab}
            />

            <ContactForm
              translations={translations}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              submitError={submitError}
              whatsappUrl={whatsappUrl}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              validationErrors={validationErrors}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;