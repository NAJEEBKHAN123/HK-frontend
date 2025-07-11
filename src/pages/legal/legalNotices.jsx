import React, { useContext } from "react";
import { jsPDF } from "jspdf";
import CommonLegalInfo from "./CommonLegalInfo";
import frTranslations from '../../locales/fr.json';
import enTranslations from '../../locales/en.json';
import { LanguageContext } from "../../context/LanguageContext";

function LegalNotices({ documentType = "legal_notices" }) {
  const { language } = useContext(LanguageContext);
  const t = language === 'fr' ? frTranslations.LegalNotices : enTranslations.LegalNotices;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(language === 'fr' ? "Mentions Légales" : "Legal Notices", 105, 30, { align: "center" });
    doc.setFontSize(16);
    doc.text("OSHK Legal Information", 105, 45, { align: "center" });
    doc.addPage();

    let yPosition = 20;

    sections.forEach((section) => {
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(section.title, 15, yPosition);
      yPosition += 10;

      const cleanContent = typeof section.content === 'string' 
        ? section.content 
        : extractTextFromJSX(section.content)
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

    doc.save(`OSCHK-${language === 'fr' ? 'Mentions-Legales' : 'Legal-Notices'}.pdf`);
  };

  const extractTextFromJSX = (node) => {
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
  };

  const sections = [
    {
      id: "company-info",
      title: t.sections.company_info.title,
      content: (
        <ul className="space-y-3 text-gray-700 mt-10">
          {Object.entries(t.sections.company_info.content).map(([key, value]) => (
            <li key={key} className="flex items-start">
              <strong className="text-gray-900 font-medium w-40 flex-shrink-0">
                {value.label}:
              </strong>
              <span>{value.text}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "publication-director",
      title: t.sections.publication_director.title,
      content: (
        <ul className="space-y-3 text-gray-700">
          {Object.entries(t.sections.publication_director.content).map(([key, value]) => (
            <li key={key} className="flex items-start">
              <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
                {value.label}:
              </strong>
              <span>{value.text}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "hosting-provider",
      title: t.sections.hosting_provider.title,
      content: (
        <ul className="space-y-3 text-gray-700">
          {Object.entries(t.sections.hosting_provider.content).map(([key, value]) => (
            <li key={key} className="flex items-start">
              <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
                {value.label}:
              </strong>
              <span>{value.text}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "intellectual-property",
      title: t.sections.intellectual_property.title,
      content: <p className="text-gray-700">{t.sections.intellectual_property.content}</p>,
    },
    {
      id: "data-protection",
      title: t.sections.data_protection.title,
      content: <p className="text-gray-700">{t.sections.data_protection.content}</p>,
    },
    {
      id: "cookies-usage",
      title: t.sections.cookies_usage.title,
      content: <p className="text-gray-700">{t.sections.cookies_usage.content}</p>,
    },
    {
      id: "liability-limitations",
      title: t.sections.liability_limitations.title,
      content: <p className="text-gray-700">{t.sections.liability_limitations.content}</p>,
    },
    {
      id: "applicable-law",
      title: t.sections.applicable_law.title,
      content: <p className="text-gray-700">{t.sections.applicable_law.content}</p>,
    },
    {
      id: "download",
      title: t.sections.download.title,
      content: (
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-4">{t.sections.download.content}</p>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {t.sections.download.button}
          </button>
        </div>
      ),
    },
  ];

  const renderSection = (section) => (
    <section id={section.id} className="mb-12 w-full" key={section.id}>
      <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
      <div className="w-full">{section.content}</div>
    </section>
  );

  return (
    <div className="bg-white">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 max-w-[1040px] mx-auto">
            <CommonLegalInfo />
          </div>

          <aside className="max-80 sm:w-1/2 md:w-1/3 lg:w-2/6">
            <section className="sticky top-4 bg-gray-100 px-6 pt-4 rounded-lg border border-gray-200 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {t.table_of_contents}
              </h2>
              <ul className="mb-6">
                {sections.map((section) => (
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

      <div className="w-full px-2">
        {sections.map(renderSection)}
      </div>
    </div>
  );
}

export default LegalNotices;