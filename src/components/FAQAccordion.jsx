import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FAQAccordion = ({ faqs }) => {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(prevId => prevId === id ? null : id);
  };

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
    <div className="space-y-4">
      {faqs.map((faq) => {
        const faqId = faq.id;
        
        return (
          <motion.div 
            key={faqId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            itemScope
            itemType="https://schema.org/Question"
          >
            <button
              onClick={() => toggleItem(faqId)}
              className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              aria-expanded={openId === faqId}
              aria-controls={`faq-answer-${faqId}`}
            >
              <h3 className="text-lg font-medium text-gray-900" itemProp="name">
                {faq.question}
              </h3>
              <motion.svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{
                  rotate: openId === faqId ? 180 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            
            <motion.div
              initial="closed"
              animate={openId === faqId ? "open" : "closed"}
              variants={itemVariants}
              className="overflow-hidden"
              id={`faq-answer-${faqId}`}
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div className="px-6 pb-6 pt-2 text-gray-600" itemProp="text">
                {faq.answer.split('. ').map((sentence, i, arr) => (
                  <p key={i} className="mb-3">
                    {i === arr.length - 1 ? sentence : `${sentence}.`}
                  </p>
                ))}
                {faq.links?.map(link => (
                  <Link 
                    key={link.id}
                    to={link.url}
                    className="mt-3 inline-flex items-center text-blue-600 hover:underline"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;