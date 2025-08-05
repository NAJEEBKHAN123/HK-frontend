import { FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

const ContactForm = ({ 
  translations, 
  formData, 
  handleChange, 
  handleSubmit, 
  isSubmitting, 
  submitStatus,
  submitError,
  whatsappUrl,
  activeTab,
  setActiveTab,
  validationErrors
}) => {
  return (
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
            className={` py-4 px-6 text-center border-b-2 font-medium text-sm ${
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
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.formSuccess}</span>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{submitError || translations.formError}</p>
                      <div className="mt-3">
                        <a
                          href={whatsappUrl}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp className="mr-2" />
                          {translations.contactViaWhatsapp}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.formLabels.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      validationErrors?.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`}
                    placeholder={translations.formPlaceholders.name}
                  />
                  {validationErrors?.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.formLabels.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      validationErrors?.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`}
                    placeholder={translations.formPlaceholders.email}
                  />
                  {validationErrors?.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.formLabels.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      validationErrors?.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`}
                    placeholder={translations.formPlaceholders.phone}
                  />
                  {validationErrors?.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.formLabels.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      validationErrors?.message ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`}
                    placeholder={translations.formPlaceholders.message}
                  />
                  {validationErrors?.message && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
                  )}
                </div>

                <div className="pt-2">
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
  );
};

export default ContactForm;