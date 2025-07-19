import React, { useContext } from 'react';
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { LanguageContext } from "../context/LanguageContext";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { useNavigate } from "react-router-dom";


// Animation Configs (unchanged)
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
      mass: 0.4,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  }),
  hover: {
    x: 3,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  boxShadow: [
    "0 0 0 rgba(234, 179, 8, 0)",
    "0 0 12px rgba(234, 179, 8, 0.4)",
    "0 0 0 rgba(234, 179, 8, 0)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeOut",
  },
};

export default function PricingSection() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const translations =
    language === "fr" ? frTranslations.pricing : enTranslations.pricing;

  // Define consistent plan keys and base prices
  const planData = {
    STARTER: {
      en: "STARTER Pack",
      fr: "Pack STARTER",
      price: 3900
    },
    TURNKEY: {
      en: "TURNKEY Pack",
      fr: "Pack TURNKEY",
      price: 4600
    },
    PREMIUM: {
      en: "PREMIUM Pack",
      fr: "Pack PREMIUM",
      price: 9800
    }
  };

  // Create pricing plans with consistent keys
  const pricingPlans = Object.keys(planData).map((key, index) => {
    const isRecommended = index === 1;
    return {
      key,
      title: planData[key][language] || planData[key].en,
      price: `€${planData[key].price.toLocaleString()}`,
      priceValue: planData[key].price,
      features: translations?.plans?.[index]?.features || [],
      recommended: isRecommended,
      recommended_text: isRecommended ? (language === 'fr' ? 'RECOMMANDÉ' : 'RECOMMENDED') : ''
    };
  });

  // SEO-optimized hidden content
  const seoContent = {
    fr: `Création entreprise Hong Kong à partir de ${planData.STARTER.price}€. Société offshore avec avantages fiscaux.`,
    en: `Hong Kong company formation from ${planData.STARTER.price}€. Offshore company with tax advantages.`
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={container}
      viewport={{ once: true, amount: 0.1 }}
      className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8 xl:px-20"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(pattern.webp)" }} />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-900/30 to-transparent" />
      <motion.div
        className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-yellow-600/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hidden SEO content */}
      <div className="hidden" aria-hidden="true">
        {seoContent[language]}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div variants={container} className="text-center mb-12 md:mb-20">
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 120,
                  delay: 0.1,
                },
              },
            }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white"
            itemProp="name"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
            >
              {translations?.title}
            </motion.span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100,
                },
              },
            }}
            className="text-gray-300 lg:text-center max-w-4xl mx-auto text-lg pt-4 md:text-xl"
            itemProp="description"
          >
            <span className="text-yellow-400">{translations?.subtitlePart1}</span>{" "}
            {translations?.subtitlePart2}{" "}
            <span className="text-yellow-400">{translations?.subtitlePart3}</span>{" "}
            {translations?.subtitlePart4}
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 px-1 md:-mx-2 sm:-mx-2 lg:px-12 xl:px-2"
        > 
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className={`relative w-full rounded-xl border p-6 sm:p-8 grid grid-rows-[auto_1fr_auto] transition-all duration-300 backdrop-blur-sm ${
                plan.recommended
                  ? "border-yellow-400 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-yellow-500/20"
                  : "border-gray-700 bg-gray-900/60 hover:border-gray-600"
              }`}
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="price" content={plan.priceValue} />
              <meta itemProp="priceCurrency" content="EUR" />
              <link itemProp="availability" href="https://schema.org/InStock" />
              <meta itemProp="url" content={`${window.location.origin}/order-form?plan=${plan.key}&price=${plan.priceValue}`} />

              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

              {plan.recommended && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold shadow"
                  {...pulseAnimation}
                >
                  {plan.recommended_text}
                </motion.div>
              )}

              <div className="min-h-[60px] flex flex-col items-center justify-center mb-4">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl sm:text-2xl text-center font-bold text-white"
                  itemProp="name"
                >
                  {plan.title}
                </motion.h3>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      delay: 0.2,
                      stiffness: 150,
                    },
                  }}
                  className="text-3xl sm:text-4xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mt-2"
                  itemProp="price"
                >
                  {plan.price}
                </motion.div>
              </div>

              <motion.hr
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: 0.3,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                className={`w-full border-t mb-6 ${plan.recommended ? "border-yellow-400/30" : "border-gray-700"}`}
              />

              <ul className="space-y-1 text-left text-base" itemProp="description">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    variants={listItemVariants}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="flex items-start gap-3 p-1 group-hover:translate-x-1 transition-transform"
                  >
                    <motion.span
                      whileHover={{
                        rotate: [0, 10, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    </motion.span>
                    <span className="text-gray-300 group-hover:text-gray-100 transition-colors">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={() =>
                  navigate(`/order-form?plan=${plan.key}&price=${plan.priceValue}`)
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.6,
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: plan.recommended 
                    ? "0 8px 25px rgba(234, 179, 8, 0.5)"
                    : "0 8px 20px rgba(255, 255, 255, 0.1)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className={`mt-4 -mb-2 w-full py-3 rounded-lg font-semibold text-lg shadow-lg transition-all ${
                  plan.recommended
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-gray-600 hover:border-gray-500"
                }`}
                aria-label={
                  language === "fr" 
                    ? `Choisir le plan ${plan.title} pour création entreprise Hong Kong` 
                    : `Select ${plan.title} plan for Hong Kong company formation`
                }
              >
                {translations?.cta_button || "Get Started"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}