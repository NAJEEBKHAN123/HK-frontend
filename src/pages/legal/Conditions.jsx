import React, { useContext } from "react";
import { jsPDF } from "jspdf";
import CommonLegalInfo from "./CommonLegalInfo";
import frTranslations from '../../locales/fr.json';
import enTranslations from '../../locales/en.json';
import { LanguageContext } from "../../context/LanguageContext";

function Conditions() {
  const { language } = useContext(LanguageContext);
  const translations = language === 'fr' ? frTranslations.Conditions_legal : enTranslations.Conditions_legal;

  const generalConditions = {
    sections: translations.sections.map(section => ({
      ...section,
      content: renderTranslatedContent(section.content, section.id)
    }))
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(
      language === 'fr' ? "Conditions Générales" : "General Conditions", 
      105, 
      30, 
      { align: "center" }
    );
    doc.setFontSize(16);
    doc.text("OSHK Legal Information", 105, 45, { align: "center" });
    doc.addPage();

    let yPosition = 20;

    generalConditions.sections.forEach((section) => {
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(section.title, 15, yPosition);
      yPosition += 10;

      const cleanContent = extractTextFromJSX(section.content)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ");

      doc.setFontSize(11);
      const contentLines = doc.splitTextToSize(cleanContent, 180);

      contentLines.forEach((line) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 15, yPosition);
        yPosition += 7;
      });

      yPosition += 10;
    });

    doc.save(
      `OSCHK-${language === 'fr' ? 'Conditions-Generales' : 'General-Conditions'}.pdf`
    );
  };

  function extractTextFromJSX(node) {
    if (typeof node === 'string') return node;
    if (React.isValidElement(node)) {
      return React.Children.map(node.props.children, child => 
        extractTextFromJSX(child)
      ).join(' ');
    }
    if (Array.isArray(node)) {
      return node.map(child => extractTextFromJSX(child)).join(' ');
    }
    return '';
  }

  function renderTranslatedContent(content, sectionId) {
    switch(sectionId) {
      case 'property':
        return (
          <>
            <p>{content.paragraph1}</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">{content.subsection.title}</h3>
            <p>{content.subsection.content}</p>
          </>
        );
      case 'contact':
        return (
          <address className="bg-gray-50 p-6 rounded-lg not-italic">
            <strong className="text-lg">{content.company}</strong><br />
            {content.address.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}<br />
              </React.Fragment>
            ))}
            {content.email.label}{' '}
            <a 
              href={`mailto:${content.email.text}`} 
              className="text-blue-600 hover:underline"
            >
              {content.email.text}
            </a>
          </address>
        );
      case 'download':
        return (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">{content.paragraph}</p>
            <button 
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {content.button}
            </button>
          </div>
        );
      default:
        if (typeof content === 'object' && content !== null) {
          return <p>{content}</p>;
        }
        return <p>{content}</p>;
    }
  }

  const renderSection = (section) => {
    return (
      <section id={section.id} className="mb-12 w-full" key={section.id}>
        <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
        <div className="w-full">
          {section.content}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-white -m-1">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 max-w-[1040px] mx-auto">
            <CommonLegalInfo />
          </div>

          <aside className="max-80 sm:w-1/2 md:w-1/3 lg:w-2/6">
            <section className="sticky top-4 bg-gray-100 px-6 pt-4 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {translations.table_of_contents}
              </h2>
              <ul className="mb-6">
                {generalConditions.sections.map((section) => (
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
          </aside>
        </div>
      </div>

      <div className="w-full -mx-1">
        {generalConditions.sections.map(renderSection)}
      </div>
    </div>
  );
}

export default Conditions;