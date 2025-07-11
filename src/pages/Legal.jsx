import React, { useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HiShieldCheck,
  HiScale,
  HiDocumentText,
  HiAdjustmentsHorizontal,
  HiOutlineGlobeAlt,
  HiOutlinePuzzlePiece,
} from "react-icons/hi2";
import CookieConsent from "../pages/legal/Choices";
import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import { LanguageContext } from "../context/LanguageContext";

const Legal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useContext(LanguageContext);

  const translations = language === 'fr' ? frTranslations.LegalInfo : enTranslations.LegalInfo;

  const legalItems = [
    { icon: <HiShieldCheck size={42} />, label: translations.privacy, route: "privacy" },
    { icon: <HiScale size={42} />, label: translations.notices, route: "notices" },
    { icon: <HiDocumentText size={42} />, label: translations.conditions, route: "conditions" },
    { icon: <HiOutlinePuzzlePiece size={42} />, label: translations.cookies, route: "cookies" },
    { icon: <HiOutlineGlobeAlt size={42} />, label: translations.accessibility, route: "accessibility" },
    { icon: <HiAdjustmentsHorizontal size={42} />, label: translations.choices, route: "choices" },
  ];

  const PrivacyChoices = () => {
    return (
      <div className="space-y-6">
        <CookieConsent 
          showInitially={true}
          hideSettingsButton={true}
        />
      </div>
    );
  };

  const isDocumentView = location.pathname !== "/legal";
  const currentLabel = legalItems.find(item => location.pathname.includes(item.route))?.label || translations.pageTitle;

  return (
    <div className="lg:px-[74px] max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-12 pl-8 pt-12 uppercase">{currentLabel}</h2>

      <div className="grid px-2 grid-cols-2 md:px-6 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-10 text-center">
        {legalItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.route)}
            className={`cursor-pointer flex flex-col items-center space-y-2 transition-all ${
              location.pathname.includes(item.route)
                ? "text-cyan-700"
                : "hover:text-gray-700"
            }`}
          >
            {item.icon}
            <div className="font-semibold text-sm leading-tight">
              {item.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div className={`bg-white p-6 rounded-lg shadow transition-all ${
        isDocumentView ? "opacity-100 max-h-full" : "opacity-0 max-h-0 overflow-hidden"
      }`}>
        {location.pathname.includes("choices") ? (
          <PrivacyChoices />
        ) : (
          <Outlet />
        )}
      </div>

      {isDocumentView && (
        <div className="mt-6 text-center pb-4">
          <button
            onClick={() => navigate("/legal")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {translations.backButton}
          </button>
        </div>
      )}
    </div>
  );
};

export default Legal;