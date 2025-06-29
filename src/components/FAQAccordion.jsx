import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';

const FAQAccordion = ({ faqs }) => {
  const [openId, setOpenId] = useState(null);
  const { language } = useContext(LanguageContext);

  // Enhanced animation variants for better UX
  const itemVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <motion.div 
          key={faq.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true, margin: "-50px" }}
          className="border-t border-b border-l-0 rounded-md border-r-0 border-gray-200"
          itemScope
          itemType="https://schema.org/Question"
        >
          <motion.button
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
            aria-expanded={openId === faq.id}
            aria-controls={`faq-answer-${faq.id}`}
            id={`faq-question-${faq.id}`}
            whileHover={{ 
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
          >
            <span className="font-medium text-gray-900 text-left" itemProp="name">
              {faq.question}
            </span>
            <motion.svg
              className={`w-5 h-5 text-gray-500`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{
                rotate: openId === faq.id ? 180 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>
          
          <motion.div
            initial="closed"
            animate={openId === faq.id ? "open" : "closed"}
            variants={itemVariants}
            className="overflow-hidden"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
            id={`faq-answer-${faq.id}`}
            aria-labelledby={`faq-question-${faq.id}`}
          >
            <div className="p-4 pt-0 text-gray-600 border-t border-gray-200">
              {faq.answer.split('. ').map((sentence, i, arr) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={i !== arr.length - 1 ? "mb-2" : ""}
                  itemProp="text"
                >
                  {i === arr.length - 1 ? sentence : `${sentence}.`}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQAccordion;