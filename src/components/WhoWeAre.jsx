import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLinkedin,
  FaEnvelope,
  FaQuoteLeft,
  FaGlobeAsia,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import jean from "../assets/member1.jpg";
import ludo from "../assets/Ludovic-Martinjpg.jpg";
import office from "../assets/office.webp";
import pattern from "../assets/pattern.webp";
import hkSkyline from "../assets/hksky.webp";
import hknight from "../assets/hongkong-night.webp";
import { LanguageContext } from "../context/LanguageContext";
import enTranslation from "../locales/en.json";
import frTranslation from "../locales/fr.json";

const icons = {
  FaGlobeAsia,
  FaHandshake,
  FaChartLine,
  FaShieldAlt
};

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export default function WhoWeAre() {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslation.WhoWeAre : enTranslation.WhoWeAre;
  
  const [activeMember, setActiveMember] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookClick = (e) => {
    e.preventDefault();
    navigate("/#booking-section", { state: { scrollToForm: true } });
  };

  

  const closeModal = () => {
    setActiveMember(null);
    document.body.style.overflow = "auto";
  };

  const teamMembers = [
    {
      id: "founder",
      name: translations.team.founder.name,
      role: translations.team.founder.role,
      photo: ludo,
      years: translations.team.founder.years,
      quote: translations.team.founder.quote,
      bio: translations.team.founder.bio,
      expertise: translations.team.founder.expertise
    },
    {
      id: "collaborator",
      name: translations.team.collaborator.name,
      role: translations.team.collaborator.role,
      photo: jean,
      years: translations.team.collaborator.years,
      quote: translations.team.collaborator.quote,
      bio: translations.team.collaborator.bio,
      expertise: translations.team.collaborator.expertise
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-28 px-5 lg:px-20">
      {/* Background Elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${hkSkyline})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl"
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16 md:mb-24 px-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-sm sm:text-lg font-medium text-blue-400 mb-4 tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {translations.hero.tagline}
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              {translations.hero.title}
              <motion.span
                className="inline-block"
                animate={{ color: ["#3b82f6", "#06b6d4", "#3b82f6"] }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                {translations.hero.titleHighlight}
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            className="max-w-4xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {translations.hero.subtitle}
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-28"
        >
          {translations.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-400/30 transition-all"
              whileHover={{ y: -5 }}
            >
              <motion.p
                className="text-4xl font-bold text-blue-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                {stat.value}
              </motion.p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="relative mb-28 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div
            className="absolute inset-0 bg-[length:300px] opacity-10"
            style={{ backgroundImage: `url(${pattern})` }}
          />

          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {translations.mission.title}
                <span className="text-blue-400">{translations.mission.titleHighlight}</span>
              </motion.h2>

              <motion.p
                className="text-lg text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {translations.mission.subtitle}
              </motion.p>

              <motion.ul
                className="space-y-4 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {translations.mission.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FaCheck className="text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {translations.mission.values.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400">
                      {React.createElement(icons[item.icon])}
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative min-h-[400px]">
              <img
                src={office}
                alt={language === 'fr' ? "Notre bureau à Hong Kong" : "Our Hong Kong office"}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-center mb-20"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              {translations.team.title}
            </span>
          </motion.h2>

          {/* Founder Section */}
          <motion.div className="max-w-6xl mx-auto mb-28" variants={fadeIn}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition-all duration-300"></div>

              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
                <div className="flex flex-col lg:flex-row">
                  {/* Founder Image */}
                  <div className="lg:w-1/3 relative aspect-[4/5] lg:aspect-auto">
                    <img
                      src={ludo}
                      alt={teamMembers[0].name}
                      className="absolute inset-0 w-auto h-auto object-contain object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <h3 className="text-3xl font-bold text-white">
                        {teamMembers[0].name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-blue-400 font-semibold">
                          {teamMembers[0].role}
                        </span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-gray-400">
                          {teamMembers[0].years} {language === 'fr' ? "Ans d'Expérience" : "Years Experience"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Founder Content */}
                  <div className="lg:w-2/3 p-8 lg:p-12 flex flex-col">
                    <div className="flex items-start gap-4 mb-6">
                      <FaQuoteLeft className="text-3xl text-blue-400/30 mt-1 flex-shrink-0" />
                      <p className="text-xl italic text-gray-300">
                        "{teamMembers[0].quote}"
                      </p>
                    </div>

                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                      {teamMembers[0].bio}
                    </p>

                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-white mb-4">
                        {language === 'fr' ? "Expertise Principale" : "Core Expertise"}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {teamMembers[0].expertise.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full border border-blue-400/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Collaborator Section */}
          <motion.div className="mx-auto" variants={fadeIn}>
            <motion.h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-300">
              {translations.team.collaborator.title}
              <span className="text-blue-400">{translations.team.collaborator.titleHighlight}</span>
            </motion.h3>

            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition-all duration-300"></div>

              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
                <div className="flex flex-col lg:flex-row">
                  {/* Collaborator Content */}
                  <div className="lg:w-2/3 p-8 lg:p-12 flex flex-col">
                    <div className="flex items-start gap-4 mb-6">
                      <FaQuoteLeft className="text-3xl text-cyan-400/30 mt-1 flex-shrink-0" />
                      <p className="text-xl italic text-gray-300">
                        "{teamMembers[1].quote}"
                      </p>
                    </div>

                    <div className="text-gray-300 mb-8 text-lg leading-relaxed space-y-4">
                      <p>{teamMembers[1].bio}</p>
                    </div>

                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-white mb-4">
                        {language === 'fr' ? "Expertise Principale" : "Core Expertise"}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {teamMembers[1].expertise.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-cyan-900/30 text-cyan-400 rounded-full border border-cyan-400/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Collaborator Image */}
                  <div className="lg:w-1/3 relative aspect-[4/5] lg:aspect-auto">
                    <img
                      src={jean}
                      alt={teamMembers[1].name}
                      className="absolute inset-0 w-auto h-auto object-contain object-center"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 right-0 p-4 lg:pb-6 text-right w-full bg-gradient-to-t from-black/70 to-transparent">
                      <div className="container mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {teamMembers[1].name}
                        </h3>
                        <div className="text-center flex gap-2 items-center mt-2">
                          <span className="text-cyan-400 font-semibold text-sm md:text-lg">
                            {teamMembers[1].role}
                          </span>
                          <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                          <span className="text-gray-300 text-sm md:text-base">
                            {teamMembers[1].years} {language === 'fr' ? "Ans d'Exp" : "Years Expr"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-xl overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${hknight})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-900/90" />

          <div className="relative z-10 py-16 px-8 sm:px-16 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {translations.cta.title}
              <span className="text-blue-400">{translations.cta.titleHighlight}</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {translations.cta.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleBookClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl text-lg transition-all"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {translations.cta.buttons.consultation}
              </motion.button>
              <Link to="/team">
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 font-bold rounded-xl shadow-lg hover:shadow-xl text-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {translations.cta.buttons.team}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}