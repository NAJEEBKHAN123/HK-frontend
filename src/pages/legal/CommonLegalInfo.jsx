import React, { useContext } from "react";
import {
  HiShieldCheck,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiCheckCircle,
  HiCalendar,
} from "react-icons/hi";
import { FaWhatsapp, FaCode } from "react-icons/fa";
import frTranslations from "../../locales/fr.json";
import enTranslations from "../../locales/en.json";
import { LanguageContext } from "../../context/LanguageContext";

function CommonLegalInfo() {
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.commonLegalInfo : enTranslations.commonLegalInfo;

  return (
    <div className="w-full mx-auto">
      {/* Site Editor Section */}
      <section id="site-editor" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t.siteEditor.title}</h2>
        <p className="mb-8"
        dangerouslySetInnerHTML={{
         __html: t.siteEditor.intro.replace('{link}',
             `<a href="https://ouvrir-societe-hong-kong.fr" class="text-blue-500">${t.siteEditor.linkText}</a>`
          )
        }}
        >
        
        </p>

        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <HiShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
            {t.siteEditor.contactTitle}
          </h3>

          <ul className="space-y-3.5 mb-4 text-gray-700">
            <li className="flex items-start">
              <FaCode className="w-5 h-5 mr-3 mt-0.5 text-indigo-600 flex-shrink-0" />
              <span>{t.siteEditor.developer}</span>
            </li>

            <li className="flex items-start">
              <HiLocationMarker className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>
                203 - 2/F, UPPER OFFICES HANKOW CTR
                <br />
                5-15 HANKOW RD TSIM SHA TSUI
                <br />
                HONG KONG
              </span>
            </li>

            <li className="flex items-start">
              <HiPhone className="w-5 h-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>+33 630 258 982</span>
            </li>

            <li className="flex items-start">
              <HiMail className="w-5 h-5 mr-3 mt-0.5 text-purple-500 flex-shrink-0" />
              <span>bonjour@ouvrir-societe-hong-kong.fr</span>
            </li>

            <li className="flex items-start">
              <FaWhatsapp className="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <span className="block">{t.siteEditor.whatsapp.label}</span>
                <a
                  href="https://wa.me/+33630258982"
                  className="text-blue-600 hover:underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.siteEditor.whatsapp.cta}
                </a>
              </div>
            </li>
          </ul>

          <div className="flex items-center">
            <HiCalendar className="w-5 h-5 mr-2 text-amber-500" />
            <p className="text-gray-700">
              <strong className="text-gray-800">{t.siteEditor.nif}:</strong>{" "}
              78164472-000-05-25-0
            </p>
          </div>
        </div>
      </section>

      {/* Site Owner Section */}
      <section id="site-owner" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t.siteOwner.title}</h2>
        <p className="mb-8" dangerouslySetInnerHTML={{
          __html: t.siteOwner.intro.replace('{company}', `<strong>${t.siteOwner.company}</strong>`)
        }} />

        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
            <HiCheckCircle className="h-6 w-6 mr-2 text-blue-600" />
            {t.siteOwner.legalInfo}
          </h3>
          <ul className="space-y-3.5 text-gray-700">
            <li className="flex items-start">
              <strong className="text-gray-900 font-medium w-28 flex-shrink-0">
                {t.siteOwner.taxNumber}
              </strong>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
                78164472-000-05-25-0
              </span>
            </li>
            <li className="flex items-start">
              <strong className="text-gray-900 font-medium w-28 flex-shrink-0">
                {t.siteOwner.headOffice}
              </strong>
              <span className="px-2">
                203 - 2/F, UPPER OFFICES HANKOW CTR
                <br />
                5-15 HANKOW RD TSIM SHA TSUI
                <br />
                HONG KONG
              </span>
            </li>
            <li className="flex items-start">
              <strong className="text-gray-900 font-medium w-28 flex-shrink-0">
                {t.siteOwner.email}
              </strong>
              <a
                href="mailto:bonjour@ouvrir-societe-hong-kong.fr"
                className="text-blue-600 px-2 hover:text-blue-800 hover:underline transition-colors"
              >
                bonjour@ouvrir-societe-hong-kong.fr
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default CommonLegalInfo;