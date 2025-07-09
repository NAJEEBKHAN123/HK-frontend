import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.faq : enTranslations.faq;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState([]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: language === 'fr' ? 'Toutes' : 'All' },
    { id: 'company', name: language === 'fr' ? 'Société' : 'Company' },
    { id: 'tax', name: language === 'fr' ? 'Fiscalité' : 'Tax' },
    { id: 'banking', name: language === 'fr' ? 'Banque' : 'Banking' },
    { id: 'legal', name: language === 'fr' ? 'Juridique' : 'Legal' }
  ];

  // Enhanced FAQ data with categories
  const enhancedFaqs = translations.questions.map(faq => ({
    ...faq,
    category: faq.category || 'general'
  }));

  // Filter FAQs based on search and category
  const filteredFaqs = enhancedFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

const toggleItem = (id) => {
  setExpandedItems(prev => {
    if (prev.includes(id)) {
      return prev.filter(itemId => itemId !== id);
    } else {
      return [prev, id];
    }
  });
};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{translations.title}</title>
        <meta name="description" content={translations.subtitle} />
      </Helmet>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16 lg:mt-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4">
                <FaQuestionCircle className="mr-2" />
                <span className="font-medium">{language === 'fr' ? 'FAQ' : 'FAQs'}</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {translations.title}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              {translations.subtitle}
            </motion.p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            className="mb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher des questions...' : 'Search questions...'}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* FAQ List */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleItem(faq.id || index)}
                      className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <FiChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedItems.includes(faq.id || index) ? 'transform rotate-180' : ''
                      }`} />
                    </button>
                    
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: expandedItems.includes(faq.id || index) ? 'auto' : 0,
                        opacity: expandedItems.includes(faq.id || index) ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-600">
                        <p>{faq.answer}</p>
                        {faq.links.map(link =>(
                            <a 
                            key={link.id}
                            href={link.url}
                            className="mt-3 inline-flex items-center text-blue-600 hover:underline"
                          >
                            {link.text}
                          </a>
                        )) }
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={itemVariants}
                className="text-center py-12"
              >
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {language === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
                </h3>
                <p className="text-gray-600">
                  {language === 'fr' 
                    ? 'Essayez de modifier vos critères de recherche' 
                    : 'Try adjusting your search criteria'}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              {language === 'fr' 
                ? 'Vous ne trouvez pas votre réponse ?' 
                : "Can't find your answer?"}
            </h3>
            <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Notre équipe est disponible pour répondre à toutes vos questions.' 
                : 'Our team is available to answer all your questions.'}
            </p>
           <Link to="/contact">
            <button className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </button>
           </Link>
          </motion.div>
        </div>
      </motion.main>
    </>
  );
};

export default FAQPage;