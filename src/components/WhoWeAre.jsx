import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLinkedin,
  FaEnvelope,
  FaQuoteLeft,
  FaGlobeAsia,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import jean from "../assets/founder2.webp";
import ludo from "../assets/Ludovic-Martinjpg.jpg";
import sophie from "../assets/female.webp";
import office from "../assets/office.webp";
import pattern from "../assets/pattern.webp";
import hkSkyline from "../assets/hksky.webp";
import hknight from "../assets/hongkong-night.webp";
// const hkSkyline = "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80";


const team = [
  {
    name: "Jean Dubois",
    role: "Head of Accounting",
    bio: "12+ years in Hong Kong corporate law. Fluent in French, English, and Cantonese.",
    photo: jean,
    specialty: ["Company Formation", "Bank Compliance", "Tax Structuring"],
    contact: "jean@hongkongbusiness.com",
    linkedin: "#",
    quote:
      "The right corporate structure can save you 30% or more in unnecessary taxes.",
    years: 12,
  },
  {
    name: "Ludovic Martin",
    role: "Founder & Legal Expert",
    bio: "Former Big 4 tax consultant with 15+ years experience in international tax optimization.",
    photo: ludo,
    specialty: [
      "Financial Reporting",
      "Cross-Border Taxation",
      "VAT Compliance",
    ],
    contact: "ludovic@hongkongbusiness.com",
    linkedin: "#",
    quote:
      "Hong Kong remains the most business-friendly jurisdiction in Asia for European entrepreneurs.",
    years: 15,
  },
  {
    name: "Sophie Chen",
    role: "Banking Relations Director",
    bio: "15 years facilitating international banking solutions for foreign entrepreneurs in Asia.",
    photo: sophie,
    specialty: [
      "Account Opening",
      "Payment Solutions",
      "Trade Finance",
      "FX Management",
    ],
    contact: "sophie@hongkongbusiness.com",
    linkedin: "#",
    quote:
      "We've helped clients open accounts with every major bank in Hong Kong.",
    years: 15,
  },
];

const stats = [
  { value: "200+", label: "Companies Formed" },
  { value: "98%", label: "Success Rate" },
  { value: "24h", label: "Average Response Time" },
  { value: "15+", label: "Banking Partners" },
];

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

const floatingVariants = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function WhoWeAre() {
  const [activeMember, setActiveMember] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    const handleBookClick = (e) => {
    e.preventDefault();
    
    if (window.location.pathname === '/') {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
        const sectionPosition = bookingSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth'
        });
        
        window.history.replaceState(null, '', '/#booking-section');
      }
    } else {
      navigate('/', {
        state: { scrollToBooking: true }
      });
    }
  };

  const openModal = (member) => {
    setActiveMember(member);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveMember(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-28 px-5 sm:px-10">
      {/* Decorative elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${hkSkyline})`,
          backgroundSize: "800px",
          backgroundBlendMode: "overlay",
        }}
      />

      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/30 to-transparent" />

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

      <div className="max-w-7xl lg:px-[90px] sm:-mx-5 mx-auto relative z-10">
        {/* Header with parallax effect */}
     <motion.div 
  // style={{ y: scrollY * 0.1 }} 
  className="text-center mb-12 md:mb-20 px-4"  // Added horizontal padding
>
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}  // Reduced margin for mobile
    transition={{ delay: 0.2 }}
    className="text-sm sm:text-lg font-medium text-blue-400 mb-3 sm:mb-4 tracking-widest" // Responsive size
  >
    EXPERTISE & EXCELLENCE
  </motion.p>

  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}  // Reduced margin
    transition={{ delay: 0.3 }}
    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white" // Responsive sizes
  >
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
      Your Trusted Partners
    </span>
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 }}
    className="max-w-4xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 px-2"  // Responsive size + padding
  >
    A team of seasoned professionals dedicated to your Hong Kong business success.
    We're a team of passionate experts helping European entrepreneurs <span className="text-blue-300 font-semibold">regain financial freedom </span>
      through Hong Kong business-friendly environment. With combined experience across <span className="text-blue-300 font-semibold">law, accounting and banking</span>, we provide end-to-end solutions.
    
  </motion.p>
</motion.div>
 
        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-28"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <p className="text-4xl font-bold text-blue-400 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission statement with floating elements */}
        <motion.div
          className="relative mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="absolute -left-20 -top-20 w-48 h-48 bg-blue-600/10 rounded-full blur-xl" />
          <div className="absolute -right-20 -bottom-20 w-64 h-28 bg-cyan-600/10 rounded-full blur-xl" />

          <motion.div
            variants={fadeIn}
            className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 lg:rounded-xl rounded-md overflow-hidden"
          >
            <div
              className="absolute inset-0  bg-[length:300px] opacity-10"
              style={{ backgroundImage: `url(${pattern})` }}
            />
            <div className="grid lg:grid-cols-2">
              <div className="p-6 lg:p-10">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Beyond{" "}
                  <span className="text-blue-400">Company Formation</span>
                </motion.h2>

                <motion.p
                  className="text-lg text-gray-300 mb-8 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  We provide{" "}
                  <span className="text-blue-400 font-medium">
                    end-to-end solutions
                  </span>{" "}
                  that go far beyond simple incorporation. From banking
                  relationships to ongoing compliance, our team becomes your
                  extended executive team in Hong Kong. <span span className="text-blue-400 font-medium">24/7 local support in HK</span > and <span span className="text-blue-400 font-medium">Native French-speakingteam</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    {
                      icon: <FaGlobeAsia className="text-2xl" />,
                      text: "Global Expertise",
                    },
                    {
                      icon: <FaHandshake className="text-2xl" />,
                      text: "Trusted Partners",
                    },
                    {
                      icon: <FaChartLine className="text-2xl" />,
                      text: "Growth-Focused",
                    },
                    {
                      icon: <FaShieldAlt className="text-2xl" />,
                      text: "Full Compliance",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400">
                        {item.icon}
                      </div>
                      <span className="text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="relative">
                <motion.div
                  className="absolute inset-0  bg-cover bg-center"
                  style={{ backgroundImage: `url(${office})` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Team section */}
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
              Meet The Founders
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="relative group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => openModal(member)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-50 blur-md transition-all duration-300" />

                <div className="relative h-full bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-cyan-400/30 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                  {/* Image Container - Fixed Aspect Ratio */}
                  <div className="relative h-64 w-full overflow-hidden">
                    {" "}
                    {/* Fixed height */}
                    <motion.img
                      src={member.photo}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover object-center" /* Added object-center */
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />{" "}
                    {/* Stronger gradient */}
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-blue-400">{member.role}</p>
                    </div>
                    {/* Social Icons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <a
                        href={`mailto:${member.contact}`}
                        className="p-2 bg-gray-800/80 hover:bg-gray-700/90 rounded-full text-white transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEnvelope />
                      </a>
                      <a
                        href={member.linkedin}
                        className="p-2 bg-gray-800/80 hover:bg-blue-700/90 rounded-full text-white transition-all"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin />
                      </a>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">
                          {member.years}+ years experience
                        </p>
                        <p className="text-gray-300">{member.bio}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                      <div className="flex flex-wrap gap-2">
                        {member.specialty.map((skill, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 bg-gray-800 text-sm text-blue-400 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0  bg-cover bg-center opacity-30"
          style={{backgroundImage: `url(${hknight})`}}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-gray-900/90" />

          <div className="relative z-10 py-16 px-8 sm:px-16 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Ready to Start Your <span className="text-blue-400">Hong Kong Journey</span>?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Schedule a free consultation with our experts to discuss your
              specific needs and how we can help.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleBookClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Free Consultation
              </motion.button>
            <Link to='/team'>
              <motion.button
                className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 font-bold rounded-xl shadow-lg transition-all hover:shadow-xl text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meet Full Team
              </motion.button>
            </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {activeMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
              >
                ✕
              </button>

              <div className="grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={activeMember.photo}
                    alt={activeMember.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="p-8 lg:p-12">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white">
                      {activeMember.name}
                    </h3>
                    <p className="text-blue-400 text-xl">{activeMember.role}</p>
                    <p className="text-gray-400 mt-2">
                      {activeMember.years}+ years experience
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <FaQuoteLeft className="text-2xl text-blue-400/50 mt-1" />
                      <p className="text-xl italic text-gray-300">
                        "{activeMember.quote}"
                      </p>
                    </div>
                    <p className="text-gray-300">{activeMember.bio}</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-white mb-4">
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMember.specialty.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-gray-700 text-blue-400 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={`mailto:${activeMember.contact}`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      <FaEnvelope /> Email {activeMember.name.split(" ")[0]}
                    </a>
                    <a
                      href={activeMember.linkedin}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin /> LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
