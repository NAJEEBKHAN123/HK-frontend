import { motion } from "framer-motion";
import jean from "../assets/founder2.webp";
import ludo from "../assets/Ludovic-Martinjpg.jpg";
import sophie from "../assets/female.avif";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Jean Dubois",
    role: "Head of Accounting",
    shortBio: "12+ years in Hong Kong corporate law. Fluent in French, English, and Cantonese.",
    extendedBio: [
      "Jean brings over 12 years of specialized experience in Hong Kong corporate law and financial compliance. Having worked with both multinational corporations and SMEs, he has developed a unique expertise in bridging European business practices with Asian regulatory environments.",
      "Prior to joining our firm, Jean led the APAC compliance division at a major French bank, where he implemented risk management systems for over 200 client portfolios. His dual qualification in both French and Hong Kong law makes him particularly valuable for cross-border operations."
    ],
    photo: jean,
    specialty: ["Company Formation", "Bank Compliance", "Tax Structuring"],
    education: [
      "Master of Laws (LL.M.), University of Hong Kong",
      "Diplôme d'Expertise Comptable, Paris",
      "Certified Anti-Money Laundering Specialist (CAMS)"
    ],
    highlights: [
      "Successfully registered 150+ Hong Kong companies for European clients",
      "Reduced compliance costs by 40% for 30+ SME clients",
      "Regular contributor to Hong Kong Law Journal"
    ],
    contact: "jean@hongkongbusiness.com",
    linkedin: "#",
  },
  {
    name: "Ludovic Martin",
    role: "Founder & Legal Expert",
    shortBio: "Former Big 4 tax consultant with 15+ years experience in international tax optimization.",
    extendedBio: [
      "Ludovic founded the practice after 15 years at PwC and EY, where he led the international tax team advising European corporations on Asian market entry. His strategic approach to tax structuring has saved clients millions in unnecessary liabilities.",
      "Specializing in France-Hong Kong double taxation agreements, Ludovic has been recognized by Legal 500 as a leading expert in Asian tax optimization. He regularly speaks at international tax conferences and has published several whitepapers on offshore structuring."
    ],
    photo: ludo,
    specialty: [
      "Financial Reporting",
      "Cross-Border Taxation",
      "VAT Compliance"
    ],
    education: [
      "MBA, INSEAD",
      "Chartered Tax Advisor (CTA)",
      "Certified Public Accountant (HKICPA)"
    ],
    highlights: [
      "Developed tax strategies for 10+ Fortune 500 companies",
      "Recipient of 2022 'Tax Innovator' award by Asia Finance",
      "Author of 'Tax Efficiency in Asian Markets' (2021)"
    ],
    contact: "ludovic@hongkongbusiness.com",
    linkedin: "#",
  },
  {
    name: "Sophie Chen",
    role: "Banking Relations Director",
    shortBio: "15 years facilitating international banking solutions for foreign entrepreneurs in Asia.",
    extendedBio: [
      "Sophie leverages her 15-year career in Asian banking to secure optimal financial solutions for our clients. Having worked with HSBC, Standard Chartered, and DBS, she maintains exceptional relationships with all major Hong Kong banks.",
      "Her unique understanding of both European business needs and Asian banking protocols enables her to negotiate account openings and credit facilities that would otherwise be inaccessible to foreign entrepreneurs. Sophie speaks fluent English, French, and Mandarin."
    ],
    photo: sophie,
    specialty: [
      "Account Opening",
      "Payment Solutions",
      "Trade Finance",
      "FX Management"
    ],
    education: [
      "Bachelor of Finance, University of Hong Kong",
      "Certified Treasury Professional (CTP)",
      "Certified AML and Fraud Specialist"
    ],
    highlights: [
      "Facilitated over 300 corporate account openings for non-residents",
      "Negotiated 0% FX fees for 50+ high-volume clients",
      "Featured speaker at Asian Banking Summit (2023)"
    ],
    contact: "sophie@hongkongbusiness.com",
    linkedin: "#",
  }
];

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
  return (
    <div className="bg-black lg:px-[75px] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 px-6  sm:px-10 overflow-hidden">
        <div className="max-w-6xl  mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                Our Leadership Team
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Meet the experts guiding your Hong Kong business success
            </p>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"></div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-10 px-6 sm:px-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-28"
        >
          {team.map((member, index) => (
            <motion.div 
              key={index}
              variants={fadeIn}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
            >
              <div className="grid md:grid-cols-3 gap-8 p-8 md:p-12">
                {/* Photo Column */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square max-w-xs rounded-xl overflow-hidden border-2 border-yellow-500/30">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="mt-6 w-full">
                    <h3 className="text-xl font-bold mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.specialty.map((skill, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-gray-800 text-yellow-400 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Bio Column */}
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                      {member.name}
                    </h2>
                    <h3 className="text-xl text-gray-300">{member.role}</h3>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-8">
                    {member.extendedBio.map((para, i) => (
                      <p key={i} className="mb-4 text-gray-300">{para}</p>
                    ))}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-8">
                    {/* Education */}
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-yellow-400">Education</h3>
                      <ul className="space-y-2">
                        {member.education.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Highlights */}
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-yellow-400">Professional Highlights</h3>
                      <ul className="space-y-2">
                        {member.highlights.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Contact */}
                  <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap gap-4">
                    <a
                      href={`mailto:${member.contact}`}
                      className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
                    >
                      Contact {member.name.split(' ')[0]}
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-10 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Work Directly With Our Experts
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get personalized guidance for your Hong Kong business needs
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
              >
                Schedule Consultation
              </Link>
              <Link
                to="/services"
                className="px-8 py-3 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-bold rounded-lg transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}