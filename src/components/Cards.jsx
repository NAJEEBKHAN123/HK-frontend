import React, { useContext } from "react";
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

  // SEO-optimized hidden content
  const seoContent = {
    fr: `
      Création entreprise Hong Kong à partir de ${translations?.plans?.[0]?.price || 'XXX'}€. 
      Société offshore avec avantages fiscaux et zéro impôt. Services en ligne pour incorporation rapide. 
      Comparez Hong Kong vs Dubaï pour votre entreprise internationale. Structure sociétaire optimale 
      avec compliance Hong Kong. Solutions pour start-up Asie et business expansion Asie.
    `,
    en: `
      Hong Kong company formation from ${translations?.plans?.[0]?.price || 'XXX'}€. 
      Offshore company with tax advantages and zero tax. Online services for fast incorporation. 
      Compare Hong Kong vs Dubai for your international business. Optimal corporate structure 
      with Hong Kong compliance. Solutions for Asia start-up and business expansion in Asia.
    `
  };

  const pricingPlans = (translations?.plans || []).map((plan, index) => ({
    ...plan,
    recommended: index === 1,
  }));

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={container}
      viewport={{ once: true, amount: 0.1 }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16 overflow-hidden"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Hidden SEO content */}
      <div className="hidden" aria-hidden="true">
        {seoContent[language]}
      </div>

      <div className="max-w-7xl lg:px-20 w-full">
        {/* Section Header */}
        <motion.div variants={container} className="text-center mb-16">
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
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
            itemProp="name"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-clip-text text-3xl lg:text-5xl text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
            >
              {translations?.title || "Why choose Hong Kong?"}
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
            className="text-gray-400 px-4 mt-2 text-sm sm:text-base max-w-xl mx-auto"
            itemProp="description"
          >
            {translations?.subtitle ||
              "Hong Kong is one of the most dynamic economic hubs in the world."}
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 px-3"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className={`relative w-full rounded-xl border p-4 sm:p-5 grid grid-rows-[auto_1fr_auto] transition-all duration-300 backdrop-blur-md shadow-md group ${
                plan.recommended
                  ? "border-yellow-400 bg-gradient-to-br from-gray-800 to-gray-900 shadow-yellow-500/30"
                  : "border-gray-700 bg-gray-900/60"
              }`}
              itemScope
              itemType="https://schema.org/Offer"
            >
              {/* Schema.org metadata */}
              <meta itemProp="price" content={plan.price.replace(/[^0-9]/g, '')} />
              <meta itemProp="priceCurrency" content="EUR" />
              <link itemProp="availability" href="https://schema.org/InStock" />
              <meta itemProp="url" content={`${window.location.origin}/order-form?plan=${encodeURIComponent(plan.title)}`} />

              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

              {plan.recommended && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow"
                  {...pulseAnimation}
                >
                  {plan.recommended_text || "RECOMMENDED"}
                </motion.div>
              )}

              <div className="min-h-[100px] flex flex-col items-center justify-center mb-4">
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
                  className="text-2xl sm:text-2xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                  itemProp="price"
                >
                  {plan.price || "€0"}
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
                className="w-full border-t border-gray-700 mb-4"
              />

              <ul className="space-y-2 text-left text-sm" itemProp="description">
                {(plan.features || []).map((feature, idx) => (
                  <motion.li
                    key={idx}
                    variants={listItemVariants}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="flex items-start gap-2 p-1 group-hover:translate-x-1 transition-transform"
                  >
                    <motion.span
                      whileHover={{
                        rotate: [0, 10, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    </motion.span>
                    <span className="text-gray-300 group-hover:text-gray-100 transition-colors">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={() =>
                  navigate(`/order-form?plan=${plan.title}&price=${plan.price}`)
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
                  boxShadow: "0 8px 25px rgba(234, 179, 8, 0.5)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{
                  scale: 0.97,
                  boxShadow: "0 3px 12px rgba(234, 179, 8, 0.4)",
                }}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all ${
                  plan.recommended
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-gray-600"
                }`}
                aria-label={
                  language === "fr" 
                    ? `Choisir le plan ${plan.title} pour création entreprise Hong Kong` 
                    : `Select ${plan.title} plan for Hong Kong company formation`
                }
              >
                {plan.cta_button || "Get Started"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}