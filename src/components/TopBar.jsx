import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const TopBar = () => {
  // Enhanced contact info with keywords
  const contactInfo = {
    phone: "+336 3025 8982",
    email: "bonjour@ouvrir-societe-hong-kong.fr",
    displayEmail: "bonjour@ouvrir-societe-hong-kong.fr",
    companyName: "Hong Kong Business Formation Experts",
    tagline: "Simplification administrative pour création entreprise Hong Kong"
  };

  // Social links with keyword-rich titles and descriptions
  const socialLinks = [
    {
      icon: <FaFacebook />,
      url: "#",
      label: "Conseils pour créer entreprise Hong Kong - Avantages fiscaux",
      title: "Régime fiscal avantageux Hong Kong | Société offshore experts",
      bgColor: "bg-[#3b5998]",
      ringColor: "group-hover:ring-[#3b5998]",
    },
    {
      icon: <FaLinkedin />,
      url: "#",
      label: "Réseau professionnel pour entreprise internationale en Asie",
      title: "Business expansion Asie | Fiscalité favorable Hong Kong vs Dubaï",
      bgColor: "bg-[#0077b5]",
      ringColor: "group-hover:ring-[#0077b5]",
    },
    {
      icon: <FaYoutube />,
      url: "#",
      label: "Guides: Immatriculation société et compliance Hong Kong",
      title: "Incorporation rapide Hong Kong | Structure sociétaire optimale",
      bgColor: "bg-[#ff0000]",
      ringColor: "group-hover:ring-[#ff0000]",
    },
    {
      icon: <FaInstagram />,
      url: "#",
      label: "Success stories: Entreprise prospère en Asie business hub",
      title: "Business growth Hong Kong | Zéro impôt stratégies",
      bgColor: "bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743]",
      ringColor: "group-hover:ring-[#e1306c]",
    },
    {
      icon: <FaTiktok />,
      url: "#",
      label: "Astuces: Entreprendre Hong Kong avec coûts réduits",
      title: "Low cost incorporation | Digital transformation Hong Kong",
      bgColor: "bg-[#010101]",
      ringColor: "group-hover:ring-[#010101]",
    },
  ];

  return (
    <div className="hidden min-[720px]:block bg-[#1f2946] text-white sm:px-6 py-2 px-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Contact Information - Keyword optimized */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mb-2 md:mb-0">
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
              className="flex items-center group transition-all duration-300"
              aria-label={`Consultant entreprise Hong Kong - ${contactInfo.phone}`}
              title={`Business consulting pour création entreprise - ${contactInfo.phone}`}
            >
              <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-[#f5d273]/20 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#f5d273]/50">
                <FaPhoneAlt className="h-3 w-3 text-white group-hover:text-[#f5d273] transition-colors duration-300" />
              </div>
              <span className="whitespace-nowrap group-hover:text-[#f5d273] transition-colors duration-300">
                {contactInfo.phone} 
              </span>
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center group transition-all duration-300"
              aria-label={`Enregistrement entreprise Hong Kong - ${contactInfo.displayEmail}`}
              title={`Incorporation services - ${contactInfo.displayEmail}`}
            >
              <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-[#f5d273]/20 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#f5d273]/50">
                <FaEnvelope className="h-3 w-3 text-white group-hover:text-[#f5d273] transition-colors duration-300" />
              </div>
              <span className="whitespace-nowrap group-hover:text-[#f5d273] transition-colors duration-300">
                {contactInfo.displayEmail}
              </span>
            </a>
          </div>

          {/* Social Media Links - Fully keyword optimized */}
          <div className="flex space-x-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-center h-6 w-6 rounded-full bg-white/10 transition-all duration-500 hover:scale-110 ${social.ringColor}`}
                aria-label={social.label}
                title={social.title}
              >
                <div
                  className={`absolute inset-0 rounded-full opacity-0 ${social.bgColor} transition-all duration-500 group-hover:opacity-100`}
                ></div>
                <span className="relative z-10 text-white transition-transform duration-300 group-hover:scale-125">
                  {social.icon}
                </span>
                <span
                  className={`absolute inset-0 rounded-full ring-0 ${social.ringColor} transition-all duration-500 group-hover:ring-2`}
                ></span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Hidden SEO text for crawlers */}
        <div className="hidden" aria-hidden="true">
          <p>Créer entreprise Hong Kong avec régime fiscal avantageux. Société offshore en Asie business hub avec zéro impôt sur revenus étrangers. Services en ligne pour incorporation rapide et coûts réduits. Business Hong Kong: fiscalité favorable, compliance simplifiée, portail entreprise numérique.</p>
          <p>International business setup pour entreprise prospère. Solutions pour multinational company et start-up Asie. Entreprendre Hong Kong: stratégie fiscalité business, legal business structure, digital transformation.</p>
        </div>
      </div>
    </div>
  );
};

export default TopBar;