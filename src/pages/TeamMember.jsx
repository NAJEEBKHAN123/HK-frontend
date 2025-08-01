import { motion } from "framer-motion";
import jean from "../assets/member1.jpg";
import ludo from "../assets/Ludovic-Martinjpg.jpg";
import { Link } from "react-router-dom";
import {  FaHandshake, FaChartLine } from "react-icons/fa";
import {LanguageContext} from '../context/LanguageContext'
import enTranslation from '../locales/en.json'
import frTranslation from '../locales/fr.json'
import { useContext } from "react";




const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function TeamPage() {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslation.TeamDetails : enTranslation.TeamDetails;

  const teamMembers = [
    {
      id: "founder",
      name: translations.ludovic.name,
      role: translations.ludovic.role,
      photo: ludo,
      yearsExperience: "15+",
      quote: `${translations.member.quotePrefix}${translations.ludovic.quote}${translations.member.quoteSuffix}`,
      bio: translations.ludovic.bio,
      expertise: translations.ludovic.expertise,
      achievements: translations.ludovic.achievements,
      linkedin: "#"
    },
    {
      id: "collaborator",
      name: translations.ostap.name,
      role: translations.ostap.role,
      photo: jean,
      yearsExperience: "10+",
      quote: `${translations.member.quotePrefix}${translations.ostap.quote}${translations.member.quoteSuffix}`,
      bio: translations.ostap.bio,
      expertise: translations.ostap.expertise,
      achievements: translations.ostap.achievements,
      linkedin: "#"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 sm:px-10 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-flex mb-4">
              <span className="text-blue-400 font-medium tracking-wider text-sm uppercase">
                {translations.hero.tagline}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {translations.hero.title}
              <span className="text-blue-400">{translations.hero.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {translations.hero.subtitle}
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
      </section>

      {/* Team Members */}
      <section className="py-16 px-5 xl:px-20 lg:px-20 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-20"
        >
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.id}
              variants={fadeIn}
              className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-50 to-gray-50' : 'from-gray-50 to-blue-50'} rounded-2xl overflow-hidden shadow-xl`}
            >
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Photo Column */}
                <div className="relative lg:col-span-1">
                  <div className=" w-full">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-300 font-medium">{member.role}</span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-gray-300">{member.yearsExperience} {translations.member.yearsExperience}</span>
                    </div>
                  </div>
                </div>
                
                {/* Bio Column */}
                <div className="lg:col-span-2 p-8 lg:p-12">
                  <div className="mb-8">
                    <div className="flex items-start gap-4 mb-6">
                      <p className="text-xl italic text-gray-700">{member.quote}</p>
                    </div>
                    
                    <div className="prose max-w-none mb-8 space-y-4">
                      {member.bio.map((paragraph, i) => (
                        <p key={i} className="text-gray-700">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Expertise */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
                        <FaChartLine className="text-blue-500" />
                        {translations.member.coreExpertise}
                      </h3>
                      <ul className="space-y-2">
                        {member.expertise.map((skill, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            <span className="text-gray-700">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Achievements */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
                        <FaHandshake className="text-blue-500" />
                        {translations.member.keyAchievements}
                      </h3>
                      <ul className="space-y-2">
                        {member.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-10 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              {translations.cta.title}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {translations.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                {translations.cta.contact}
              </Link>
              <Link
                to="/services"
                className="px-8 py-3 border border-white text-white hover:bg-white/10 font-bold rounded-lg transition-colors"
              >
                {translations.cta.services}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}