import React, { useContext } from "react";
import CommonLegalInfo from "./CommonLegalInfo";
import frTranslations from '../../locales/fr.json';
import enTranslations from '../../locales/en.json';
import { LanguageContext } from "../../context/LanguageContext";

function Privacy() {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.Privacy_legal : enTranslations.Privacy_legal;

  const privacyPolicy = {
    sections: translations.sections.map(section => ({
      ...section,
      content: renderTranslatedContent(section.content)
    }))
  };

  function renderTranslatedContent(content) {
    if (content.paragraph1) {
      return (
        <div className="text-gray-700 space-y-4">
          <p>{content.paragraph1}</p>
          {content.paragraph2 && (
            <p>
              {content.paragraph2.includes('{cookiePolicyLink}') ? (
                <>
                  {content.paragraph2.split('{cookiePolicyLink}')[0]}
                  <a href="/legal/cookies" className="text-blue-600 hover:underline font-medium">
                    {content.cookiePolicyLink}
                  </a>
                  {content.paragraph2.split('{cookiePolicyLink}')[1]}
                </>
              ) : (
                content.paragraph2
              )}
            </p>
          )}
          {content.listItems && (
            <ul className="list-disc list-inside space-y-2">
              {content.listItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {content.exampleTitle && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">{content.exampleTitle}</h4>
              <ul className="space-y-2">
                {content.exampleItems.map((item, index) => (
                  <li key={index}>
                    <strong className="inline-block w-28">{item.label}</strong>
                    {item.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  // Function to handle navigation to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Render section content dynamically
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
      <div className="w-full px-[-20px] lg:px-0">
        <div className="flex w-full flex-col md:flex-row gap-20">
          {/* Left column - Content sections */}
          <div className="flex-1">
            <CommonLegalInfo />
          </div>

          {/* Right column - Table of Contents */}
          <div className="max-80 sm:w-1/2 md:w-1/3 lg:w-2/6">
            <section className="top-4 mb-12 bg-gray-100 px-6 pt-4 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {translations.tableOfContents}
              </h2>
              <ul className="mb-6">
                {privacyPolicy.sections.map((section) => (
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
      <div className="w-full lg:px-4">
        {privacyPolicy.sections.map(renderSection)}
      </div>
    </div>
  );
}

export default Privacy;