import React, { useContext } from "react";
import CommonLegalInfo from "./CommonLegalInfo";
import frTranslations from '../../locales/fr.json';
import enTranslations from '../../locales/en.json';
import { LanguageContext } from "../../context/LanguageContext";

function Accessibility() {
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.Accessibility : enTranslations.Accessibility;

  const renderContent = (sectionKey) => {
    const section = t.sections[sectionKey];
    const replacements = section.content.replacements || {};
    
    const replacePlaceholders = (text) => {
      return text.replace(/{(\w+)}/g, (match, key) => {
        if (replacements[key]?.href) {
          return `<a href="${replacements[key].href}" class="text-blue-600 hover:underline font-medium">${replacements[key].text}</a>`;
        }
        return replacements[key] || match;
      });
    };

    switch(sectionKey) {
      case 'Introduction':
        return (
          <div className="text-gray-700 space-y-4">
            <p dangerouslySetInnerHTML={{ __html: replacePlaceholders(section.content.paragraph1) }} />
            <p dangerouslySetInnerHTML={{ __html: replacePlaceholders(section.content.paragraph2) }} />
          </div>
        );
      
      case 'Accessibility-Status':
        return (
          <div className="text-gray-700 bg-gray-200 p-4 rounded-lg space-y-4">
            <p><strong>{language === 'fr' ? 'Statut :' : 'Status:'}</strong> {section.content.status}</p>
            <p><strong>{language === 'fr' ? 'Date d\'audit :' : 'Audit Date:'}</strong> {section.content.auditDate}</p>
            <p dangerouslySetInnerHTML={{ __html: replacePlaceholders(section.content.description) }} />
          </div>
        );

      case 'Dark-Mode':
        return (
          <div className="text-gray-700 space-y-4">
            <p dangerouslySetInnerHTML={{ __html: replacePlaceholders(section.content.paragraph1) }} />
          </div>
        );

      case 'Accessibility-Tools':
        return (
          <div className="text-gray-700 space-y-4">
            <p><strong>{section.content.toolsTitle}</strong></p>
            <ul className="list-disc list-inside space-y-1">
              {section.content.toolsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p><strong>{section.content.techTitle}</strong></p>
            <ul className="list-disc list-inside space-y-1">
              {section.content.techList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'Non-Conformities':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{section.content.intro}</p>
            <ul className="list-disc list-inside space-y-2">
              {section.content.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        );

      case 'Exemptions':
        return (
          <div className="text-gray-700 space-y-4">
            <p dangerouslySetInnerHTML={{ __html: replacePlaceholders(section.content.paragraph1) }} />
            <ul className="list-disc list-inside space-y-2">
              {section.content.exemptionsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'Feedback-Contact':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{section.content.paragraph1}</p>
            <p>
              <strong>{section.content.emailLabel}</strong>{" "}
              <a href={`mailto:${section.content.email}`} className="text-blue-600 hover:underline font-medium">
                {section.content.email}
              </a>
            </p>
            <p>
              <strong>{section.content.phoneLabel}</strong> {section.content.phone}
            </p>
            <p>
              <strong>{section.content.responseTime.split(':')[0]}:</strong> {section.content.responseTime.split(':')[1]}
            </p>
          </div>
        );

      case 'Future-Improvements':
        return (
          <div className="text-gray-700 space-y-4">
            <p>{section.content.intro}</p>
            <ul className="list-disc list-inside space-y-2">
              {section.content.improvements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="pt-2">
              <strong>{section.content.lastUpdated.split(':')[0]}:</strong> {section.content.lastUpdated.split(':')[1]}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const accessibilityStatement = {
    sections: Object.keys(t.sections).map(key => ({
      id: key,
      title: t.sections[key].title,
      content: renderContent(key)
    }))
  };

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
      <div className="w-full px-[-20px] lg:px-0">
        <div className="flex w-full flex-col md:flex-row gap-20">
          <div className="flex-1">
            <div className="max-w-[1040px] mx-auto">
              <CommonLegalInfo />
            </div>
          </div>

          <div className="max-80 sm:w-1/2 md:w-1/3 lg:w-2/6">
            <section className="top-4 mb-12 bg-gray-100 px-6 pt-4 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {t.toc_title}
              </h2>
              <ul className="mb-6">
                {accessibilityStatement.sections.map((section) => (
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
      <div className="w-full text-left">
        {accessibilityStatement.sections.map(renderSection)}
      </div>
    </div>
  );
}

export default Accessibility;