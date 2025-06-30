import React from "react";
import legalContent from "../../StaticData/legal-content.json";
import { jsPDF } from "jspdf";

function LegalNotices() {
  const documentData = {
    sections: [
      legalContent.common_sections.site_editor,
      legalContent.common_sections.site_owner,
      ...legalContent.legal_notices.sections
    ]
  };

  // Function to handle navigation to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to handle PDF download
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Legal Notices", 105, 30, { align: "center" });
    doc.setFontSize(16);
    doc.text("OSHK Legal Information", 105, 45, { align: "center" });
    doc.addPage();

    let yPosition = 20;
    
    documentData.sections.forEach((section) => {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(section.title, 15, yPosition);
      yPosition += 10;
      
      if (section.intro) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const introLines = doc.splitTextToSize(section.intro, 180);
        introLines.forEach(line => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 15, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      }
      
      const cleanContent = section.content
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ");
      
      doc.setFontSize(11);
      const contentLines = doc.splitTextToSize(cleanContent, 180);
      
      contentLines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 15, yPosition);
        yPosition += 7;
      });
      
      yPosition += 10;
    });

    doc.save("OSHK-Legal-Notices.pdf");
  };

  const renderSection = (section, index) => {
    if (index === 0 || index === 1) {
      return (
        <section id={section.id} className="mb-12 max-w-4xl mx-auto" key={section.id}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            {section.title}
          </h2>
          {section.intro && (
            <p className="mb-6 text-gray-700 leading-relaxed">
              {section.intro}
            </p>
          )}
          <div
            className={index === 0 
              ? "editor-info bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              : "owner-info bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            }
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </section>
      );
    }

    return (
      <section id={section.id} className="mb-12 max-w-4xl mx-auto" key={section.id}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{section.title}</h2>
        {section.intro && <p className="mb-6 text-gray-700 leading-relaxed">{section.intro}</p>}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </section>
    );
  };

  return (
    <div className="bg-gray-50 mx-[-16px] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Mobile TOC - Shows before content on small screens */}
        <div className="lg:hidden mb-8 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            {documentData.sections.map((section) => (
              <li
                key={section.id}
                className="cursor-pointer hover:text-blue-600 transition-colors py-1"
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </li>
            ))}
          </ul>
          <button
            onClick={handleDownloadPdf}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download as PDF
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content - comes first in DOM for mobile */}
          <div className="lg:w-2/3 order-2 lg:order-1">
            {documentData.sections.map((section, index) => (
              renderSection(section, index)
            ))}
          </div>

          {/* Desktop TOC - Shows on right side on larger screens */}
          <div className="lg:w-1/3  order-1 lg:order-2">
            <div className="sticky top-4 hidden lg:block">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Table of Contents
                </h2>
                <ul className="space-y-2">
                  {documentData.sections.map((section) => (
                    <li
                      key={section.id}
                      className="cursor-pointer hover:text-blue-600 transition-colors py-1"
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.title}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleDownloadPdf}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalNotices;