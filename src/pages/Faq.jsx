import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import FAQAccordion from '../components/FAQAccordion';
import { LanguageContext } from '../context/LanguageContext';
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';

const FAQPage = () => {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.faq : enTranslations.faq;

  // SEO metadata configuration
  const seoMetadata = {
    en: {
      canonicalUrl: "https://yourdomain.com/en/faq",
      metaKeywords: "Hong Kong company formation, offshore company, business registration, tax advantages, Asia business hub",
      ogType: "website",
      twitterCard: "summary_large_image"
    },
    fr: {
      canonicalUrl: "https://yourdomain.com/fr/faq",
      metaKeywords: "création entreprise Hong Kong, société offshore, immatriculation société, avantages fiscaux, hub business Asie",
      ogType: "website",
      twitterCard: "summary_large_image"
    }
  };

  const currentSeo = seoMetadata[language];

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
        duration: 0.5
      }
    }
  };

  // Enhanced FAQ schema with additional properties
  const generateFAQSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": translations.title,
    "description": translations.subtitle,
    "mainEntity": translations.questions.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "upvoteCount": 42,
        "dateCreated": new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Your Company Name"
        }
      }
    })),
    "publisher": {
      "@type": "Organization",
      "name": "Your Company Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png",
        "width": 600,
        "height": 60
      }
    }
  });

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{translations.title}</title>
        <meta name="description" content={translations.subtitle} />
        <meta name="keywords" content={currentSeo.metaKeywords} />
        <link rel="canonical" href={currentSeo.canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />
        <meta property="og:type" content={currentSeo.ogType} />
        <meta property="og:title" content={translations.title} />
        <meta property="og:description" content={translations.subtitle} />
        <meta property="og:url" content={currentSeo.canonicalUrl} />
        <meta property="og:site_name" content="Your Company Name" />
        <meta property="og:image" content="https://yourdomain.com/images/og-faq.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content={currentSeo.twitterCard} />
        <meta name="twitter:title" content={translations.title} />
        <meta name="twitter:description" content={translations.subtitle} />
        <meta name="twitter:image" content="https://yourdomain.com/images/twitter-faq.jpg" />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema())}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": language === 'fr' ? "Accueil" : "Home",
              "item": `https://yourdomain.com/${language}`
            }, {
              "@type": "ListItem",
              "position": 2,
              "name": translations.title,
              "item": currentSeo.canonicalUrl
            }]
          })}
        </script>
      </Helmet>

      <main className="max-w-6xl mx-auto py-20 sm:px-6 lg:px-8 xl:px-10 2xl:px-12" itemScope itemType="https://schema.org/FAQPage">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto "
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl pl-7 lg:pl-0 font-bold text-gray-900 mb-8 md:mb-10"
            itemProp="name"
          >
            {translations.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8 pl-7 lg:pl-0"
            itemProp="description"
          >
            {translations.subtitle}
          </motion.p>
          <motion.div className='px-4 lg:px-0' variants={itemVariants} itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
            <FAQAccordion faqs={translations.questions} />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default FAQPage;