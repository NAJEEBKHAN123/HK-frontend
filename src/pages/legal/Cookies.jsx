import React, { useContext } from "react";
import CommonLegalInfo from "./CommonLegalInfo";
import frTranslations from '../../locales/fr.json';
import enTranslations from '../../locales/en.json';
import { LanguageContext } from "../../context/LanguageContext";

function Cookies() {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.Cookies_legal : enTranslations.Cookies_legal;

  const cookiesPolicy = {
    last_updated: translations.last_updated,
    applies_to: translations.applies_to,
    sections: translations.sections.map(section => ({
      ...section,
      content: renderTranslatedContent(section.content, section.id)
    }))
  };

  function renderTranslatedContent(content, sectionId) {
    switch(sectionId) {
      case 'Introduction':
        return (
          <div className="text-gray-700 space-y-4">
            <p>
              {content.paragraph1.split('{websiteLink}')[0]}
              <a href="/" className="text-blue-600 hover:underline font-medium">
                {content.websiteLink}
              </a>
              {content.paragraph1.split('{websiteLink}')[1]}
            </p>
          </div>
        );
      case 'what-cookies':
      case 'scripts':
      case 'web-beacon':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{content.paragraph1}</p>
          </div>
        );
      case 'Use-Cookies':
        return (
          <div className="text-gray-700 space-y-4">
            <p>
              <strong>{content.section5_1.title}</strong> {content.section5_1.text}
            </p>
            <p>
              <strong>{content.section5_2.title}</strong> {content.section5_2.text}
            </p>
            <p>
              <strong>{content.section5_3.title}</strong> {content.section5_3.text}
            </p>
          </div>
        );
      case 'Consent':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{content.paragraph1}</p>
            <p>
              <strong>{content.section6_1.title}</strong> {content.section6_1.text}
            </p>
          </div>
        );
      case 'managing-and-delete-cookies':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{content.paragraph1}</p>
            <p>{content.paragraph2}</p>
          </div>
        );
      case 'data-rights':
        return (
          <div className="text-gray-700 space-y-4">
            <ul className="list-disc list-inside space-y-2">
              {content.rights.map((right, index) => (
                <li key={index}>
                  <strong>{right.title}</strong> {right.text}
                </li>
              ))}
            </ul>
            <p>{content.paragraph}</p>
          </div>
        );
      case 'Contact-Information':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{content.paragraph1}</p>
            <p>
              <strong>{content.company}</strong>
              <br />
              {content.address}
            </p>
            <p>
              <strong>{content.website.label}</strong>{" "}
              <a href="/" className="text-blue-600 hover:underline font-medium">
                {content.website.text}
              </a>
            </p>
            <p>
              <strong>{content.email.label}</strong>{" "}
              <a href={`mailto:${content.email.text}`} className="text-blue-600 hover:underline font-medium">
                {content.email.text}
              </a>
            </p>
            <p>
              <strong>{content.phone.label}</strong> {content.phone.text}
            </p>
            <p>
              <em>{content.update_note}</em>
            </p>
          </div>
        );
      default:
        return null;
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderSection = (section) => {
    return (
      <section id={section.id} className="mb-12 w-full" key={section.id}>
        <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
        {section.content}
      </section>
    );
  };

  return (
    <div className="bg-white -mx-1.5">
      <div className="w-full lg:px-0">
        <div className="flex w-full flex-col md:flex-row gap-20">
          <div className="flex-1">
            <div className="max-w-[1040px] mx-auto">
              <CommonLegalInfo 
                lastUpdated={cookiesPolicy.last_updated}
                appliesTo={cookiesPolicy.applies_to}
              />
            </div>
          </div>

          <div className="max-80 sm:w-1/2 md:w-1/3 lg:w-2/6">
            <section className="top-4 mb-12 pb-8 bg-gray-100 bg-cover px-6 pt-4 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {translations.table_of_contents}
              </h2>
              <ul className="mb-6">
                {cookiesPolicy.sections.map((section) => (
                  <li
                    key={section.id}
                    className="cursor-pointer hover:text-blue-600 py-1"
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.title}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      <div className="w-full text-justify lg:px-4">
        {cookiesPolicy.sections.map(renderSection)}
      </div>
    </div>
  );
}

export default Cookies;