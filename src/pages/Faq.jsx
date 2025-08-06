import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import {  FiSearch } from 'react-icons/fi';
import { FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FAQAccordion from '../components/FAQAccordion';

// SEO content for FAQ page
const faqSeoContent = {
  fr: `
    FAQ complète sur la création d'entreprise à Hong Kong: incorporation rapide, société offshore, avantages fiscaux (zéro impôt sur revenus étrangers). 
    Réponses expertes sur l'immatriculation société, compliance Hong Kong, compte bancaire offshore et régime fiscal avantageux. 
    Solutions pour entreprise internationale, start-up Asie et firme multinationale cherchant un paradise fiscal asiatique.
  `,
  en: `
    Complete FAQ about Hong Kong company formation: fast incorporation, offshore company, tax advantages (zero tax on foreign income). 
    Expert answers on company registration, Hong Kong compliance, offshore bank account and beneficial tax regime. 
    Solutions for international business, Asia start-up and multinational firms seeking Asian tax haven.
  `
};

const FAQPage = () => {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.faq : enTranslations.faq;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Enhanced categories with SEO-rich names
  const categories = [
    { id: 'all', name: language === 'fr' ? 'Toutes les questions' : 'All Questions' },
    { 
      id: 'company', 
      name: language === 'fr' ? 'Création Société' : 'Company Formation',
      keywords: language === 'fr' ? 
        ['créer société Hong Kong', 'incorporation rapide', 'enregistrement entreprise'] : 
        ['Hong Kong company formation', 'fast incorporation', 'business registration']
    },
    { 
      id: 'tax', 
      name: language === 'fr' ? 'Avantages Fiscaux' : 'Tax Advantages',
      keywords: language === 'fr' ?
        ['zéro impôt', 'régime fiscal avantageux', 'fiscalité Hong Kong'] :
        ['zero tax', 'beneficial tax regime', 'Hong Kong taxation']
    },
    { 
      id: 'banking', 
      name: language === 'fr' ? 'Banque Offshore' : 'Offshore Banking',
      keywords: language === 'fr' ?
        ['compte bancaire Hong Kong', 'banque offshore', 'services financiers'] :
        ['Hong Kong bank account', 'offshore banking', 'financial services']
    },
    { 
      id: 'legal', 
      name: language === 'fr' ? 'Conformité Juridique' : 'Legal Compliance',
      keywords: language === 'fr' ?
        ['compliance Hong Kong', 'structure sociétaire', 'loi entreprise Hong Kong'] :
        ['Hong Kong compliance', 'corporate structure', 'Hong Kong company law']
    }
  ];

  // Enhanced FAQ data with SEO-rich content
  const enhancedFaqs = translations.questions.map(faq => ({
    ...faq,
    category: faq.category || 'general',
    // Adding schema markup compatible answers
    schemaAnswer: faq.answer.replace(/([.!?])\s*(?=[A-Z])/g, '$1|').split('|')
  }));

  // Filter FAQs
  const filteredFaqs = enhancedFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  };

  // Get current category keywords for meta tags
  const currentCategory = categories.find(cat => cat.id === activeCategory);
  const categoryKeywords = currentCategory?.keywords?.join(', ') || '';

  return (
    <>
      <Helmet>
        <title>{translations.seoTitle || (language === 'fr' ? 
          "FAQ Création Société Hong Kong | Questions Fréquentes" : 
          "Hong Kong Company Formation FAQ | Frequently Asked Questions")}</title>
        
        <meta name="description" content={translations.seoDescription || (language === 'fr' ?
          "Réponses expertes sur la création d'entreprise à Hong Kong: incorporation, fiscalité, banque offshore et compliance. Tout ce que vous devez savoir." :
          "Expert answers about Hong Kong company formation: incorporation, taxation, offshore banking and compliance. Everything you need to know.")} />
        
        <meta name="keywords" content={categoryKeywords || (language === 'fr' ?
          "créer société Hong Kong, FAQ entreprise Hong Kong, société offshore, avantages fiscaux, compte bancaire offshore" :
          "Hong Kong company formation FAQ, offshore company, tax advantages, offshore bank account")} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={translations.seoTitle || (language === 'fr' ?
          "FAQ Complète Création Société Hong Kong" :
          "Complete Hong Kong Company Formation FAQ")} />
        
        <meta property="og:description" content={translations.seoDescription || (language === 'fr' ?
          "Toutes les réponses sur l'immatriculation d'entreprise à Hong Kong avec avantages fiscaux et compliance" :
          "All answers about company registration in Hong Kong with tax benefits and compliance")} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={translations.seoTitle || (language === 'fr' ?
          "FAQ Création Société Hong Kong" :
          "Hong Kong Company Formation FAQ")} />
        
        {/* Schema.org markup for FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": enhancedFaqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-gray-200 to-white py-12 px-4 sm:px-6 lg:px-8"
        itemScope
        itemType="https://schema.org/FAQPage"
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
              itemProp="name"
            >
              {translations.title}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              itemProp="description"
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
                  aria-label={language === 'fr' ? 
                    `Filtrer par ${category.name}` : 
                    `Filter by ${category.name}`}
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
    <FAQAccordion faqs={filteredFaqs} />
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
                ? 'Notre équipe d\'experts en création d\'entreprise à Hong Kong est disponible pour répondre à toutes vos questions.' 
                : 'Our team of Hong Kong company formation experts is available to answer all your questions.'}
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-8 py-3 bg-white text-blue-700 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              aria-label={language === 'fr' ? 
                "Contactez notre équipe d'experts" : 
                "Contact our expert team"}
            >
              {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </Link>
          </motion.div>
        </div>

        {/* Hidden SEO content */}
        <div className="hidden" aria-hidden="true" dangerouslySetInnerHTML={{ __html: faqSeoContent[language] }} />
      </motion.main>
    </>
  );
};

export default FAQPage;