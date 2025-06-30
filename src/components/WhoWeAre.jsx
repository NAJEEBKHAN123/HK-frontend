import { motion } from "framer-motion";
import jean from "../assets/founder2.webp";
import ludo from "../assets/Ludovic-Martinjpg.jpg";
import sophie from "../assets/female.avif";
import office from "../assets/office.webp";
import { useNavigate } from "react-router-dom";

const team = [
  {
    name: "Jean Dubois",
    role: "Head of Accounting",
    bio: "12+ years in Hong Kong corporate law. Fluent in French, English, and Cantonese.",
    photo: jean,
    specialty: ["Company Formation", "Bank Compliance", "Tax Structuring"],
    contact: "jean@hongkongbusiness.com",
    linkedin: "#",
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
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function WhoWeAre() {
  const navigate = useNavigate();

  const handleBookClick = (e) => {
    e.preventDefault();

    if (window.location.pathname === "/") {
      const bookingSection = document.getElementById("booking-section");
      if (bookingSection) {
        const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
        const sectionPosition = bookingSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: sectionPosition,
          behavior: "smooth",
        });

        window.history.replaceState(null, "", "/#booking-section");
      }
    } else {
      navigate("/", {
        state: { scrollToBooking: true },
      });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-black text-white px-7  sm:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto xl:px-[55px] lg:px-16">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-14 md:mb-20"
        >
          <h1 className="font-thin text-2xl mb-4 uppercase text-white-400">
            Who We Are
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Meet Our Team
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
            Your trusted partners for Hong Kong company formation and beyond
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="mb-16 md:mb-24 text-center max-w-4xl mx-auto"
        >
          <p className="text-lg md:text-xl leading-relaxed text-gray-300">
            We're a team of passionate experts helping European entrepreneurs
            <span className="text-yellow-400 font-medium">
              {" "}
              regain financial freedom{" "}
            </span>
            through Hong Kong's business-friendly environment. With combined
            experience across
            <span className="text-yellow-400">
              {" "}
              law, accounting, and banking
            </span>
            , we provide end-to-end solutions.
          </p>
        </motion.div>

        {/* Value Proposition Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl   p-6 sm:p-8 mb-20 shadow-xl"
        >
          <div className="grid md:grid-cols-2  gap-8 md:gap-12  items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Why Choose Us
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Unlike traditional incorporation services, we provide
                <span className="text-yellow-400 font-medium">
                  {" "}
                  ongoing strategic support{" "}
                </span>
                to ensure your Hong Kong business thrives long-term.
              </p>
              <ul className="space-y-3 md:space-y-4 text-gray-300">
                {[
                  "🇭🇰 24/7 Local Support in Hong Kong",
                  "🇫🇷 Native French-speaking team",
                  "⚖️ Legal + Accounting Under One Roof",
                  "🏦 Preferred Banking Relationships",
                  "📊 Growth-Focused Business Advisory",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-3 items-center"
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.1 * i,
                          type: "spring",
                          stiffness: 100,
                        },
                      },
                    }}
                  >
                    <span className="text-yellow-400 text-xl">
                      {item.split(" ")[0]}
                    </span>
                    <span className="text-base md:text-lg">
                      {item.substring(item.indexOf(" ") + 1)}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              className="relative h-72 md:h-80 rounded-xl overflow-hidden border-2 border-gray-700/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                src={office}
                alt="Our Hong Kong Office"
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Our Central Hong Kong Office
                  </h4>
                  <p className="text-gray-300">
                    Located in the heart of the financial district
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          className="mb-16 md:mb-24"
        >
          <motion.h3
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Leadership Team
            </span>
          </motion.h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", damping: 10 },
                }}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg group flex flex-col items-center p-5 sm:p-6"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full mb-6 border-2 border-yellow-500/20 group-hover:border-yellow-500/50 transition-all">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-full" />
                </div>
                <div className="w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-3">
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold">
                        {member.name}
                      </h4>
                      <p className="text-yellow-400 text-sm md:text-base">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex justify-center md:justify-end gap-2">
                      <a
                        href={`mailto:${member.contact}`}
                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-xs md:text-sm font-medium transition-colors"
                        aria-label={`Contact ${member.name}`}
                      >
                        Email
                      </a>
                      <a
                        href={member.linkedin}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {member.specialty.map((skill, j) => (
                      <motion.span
                        key={j}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs hover:bg-yellow-500 hover:text-black transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 md:mt-24"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Start Your Hong Kong Journey?
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            Book a free consultation with our experts to discuss your specific
            needs.
          </p>
 <div className="flex flex-col sm:flex-row justify-center gap-4">
  <motion.button
    onClick={handleBookClick}
    className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-lg shadow-lg transition-all hover:shadow-xl text-sm md:text-base"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Schedule Free Consultation
  </motion.button>
  
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to="/team"
      className="inline-block px-6 py-3 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-bold rounded-lg shadow-lg transition-all hover:shadow-xl text-sm md:text-base"
    >
      Meet Full Team
    </Link>
  </motion.div>
</div>
        </motion.div>
      </div>
    </section>
  );
}
