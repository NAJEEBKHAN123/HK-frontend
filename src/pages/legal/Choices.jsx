import React, { useState, useEffect, useContext } from 'react';
import { FaCookieBite, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../../context/LanguageContext';
import frTranslations from '../../locales/fr.json';
import enTranslations from '../../locales/en.json';

const CookieConsent = ({ 
  showInitially = false,
  hideSettingsButton = false,
  onClose 
}) => {
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.cookieConsent : enTranslations.cookieConsent;
  
  const [showConsent, setShowConsent] = useState(showInitially);
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  useEffect(() => {
    if (!showInitially && !getCookie('cookie_consent')) {
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, [showInitially]);

  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const setCookie = (name, value, days = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax${window.location.protocol === 'https:' ? ';Secure' : ''}`;
  };

  const handleAccept = () => {
    setCookie('cookie_consent', 'accepted');
    setCookie('essential_cookies', 'true');
    setCookie('analytics_cookies', 'true');
    setCookie('marketing_cookies', 'true');
    closeConsent();
  };

  const handleReject = () => {
    setCookie('cookie_consent', 'rejected');
    setCookie('essential_cookies', 'true');
    setCookie('analytics_cookies', 'false');
    setCookie('marketing_cookies', 'false');
    closeConsent();
  };

  const closeConsent = () => {
    setShowConsent(false);
    setShowPreferences(false);
    if (onClose) onClose();
  };

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className={`fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4 z-50`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-heading"
        >
          <div className="max-w-6xl mx-auto">
            {!showPreferences ? (
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0 hidden md:block">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <FaCookieBite className="text-2xl text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 id="cookie-consent-heading" className="text-lg font-bold text-gray-900 dark:text-white">
                      {t.banner.title}
                    </h2>
                    <button 
                      onClick={closeConsent}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1"
                      aria-label="Close cookie consent"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {t.banner.description}
                  </p>
                  
                  <div 
                    className={`mt-2 overflow-hidden transition-all duration-300 ${expandedDetails ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="pt-2 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <p><strong>{t.preferences.essential.title}</strong> {t.banner.details.essential}</p>
                      <p><strong>{t.preferences.analytics.title}</strong> {t.banner.details.analytics}</p>
                      <p><strong>{t.preferences.marketing.title}</strong> {t.banner.details.marketing}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedDetails(!expandedDetails)}
                    className="mt-1 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                  >
                    {expandedDetails ? (
                      <>
                        <span>{t.banner.showLess}</span>
                        <FaChevronUp className="ml-1" size={12} />
                      </>
                    ) : (
                      <>
                        <span>{t.banner.showDetails}</span>
                        <FaChevronDown className="ml-1" size={12} />
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 md:flex-col lg:flex-row">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {t.banner.acceptAll}
                  </button>
                  {!hideSettingsButton && (
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      {t.banner.settings}
                    </button>
                  )}
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {t.banner.rejectAll}
                  </button>
                </div>
              </div>
            ) : (
              <CookiePreferences 
                t={t.preferences}
                onSave={(prefs) => {
                  setCookie('cookie_consent', 'custom');
                  setCookie('analytics_cookies', prefs.analytics ? 'true' : 'false');
                  setCookie('marketing_cookies', prefs.marketing ? 'true' : 'false');
                  closeConsent();
                }}
                onCancel={() => setShowPreferences(false)}
                initialPreferences={{
                  analytics: getCookie('analytics_cookies') !== 'false',
                  marketing: getCookie('marketing_cookies') === 'true'
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CookiePreferences = ({ t, onSave, onCancel, initialPreferences }) => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: initialPreferences.analytics,
    marketing: initialPreferences.marketing
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1"
          aria-label="Close preferences"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t.essential.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.essential.status}</p>
            </div>
            <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Required</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.essential.description}
          </p>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t.analytics.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.analytics.status}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={preferences.analytics}
                onChange={() => setPreferences({...preferences, analytics: !preferences.analytics})}
                className="sr-only peer"
                aria-label={`Toggle ${t.analytics.title}`}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.analytics.description}
          </p>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t.marketing.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.marketing.status}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={preferences.marketing}
                onChange={() => setPreferences({...preferences, marketing: !preferences.marketing})}
                className="sr-only peer"
                aria-label={`Toggle ${t.marketing.title}`}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.marketing.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onSave(preferences)}
          className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t.save}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {t.cancel}
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <a 
            href="/privacy-policy" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.links.privacy}
          </a>
          <a 
            href="/cookie-policy" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.links.cookie}
          </a>
          <a 
            href="/terms" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.links.terms}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default CookieConsent;