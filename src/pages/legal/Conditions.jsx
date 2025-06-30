import React from "react";
import { useNavigate } from "react-router-dom";
import legalContent from "../../StaticData/legal-content.json";
import { jsPDF } from "jspdf";

function Conditions({ documentType = "general_conditions" }) {
  const navigate = useNavigate();

  // Get the appropriate document content
  const documentData = {
    ...legalContent.common_sections,
    sections: [
      legalContent.common_sections.site_editor,
      legalContent.common_sections.site_owner,
      ...legalContent[documentType].sections
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
    
    // Add cover page
    doc.setFontSize(22);
    doc.text(documentType === "general_conditions" 
      ? "General Conditions" 
      : "Legal Notices", 105, 30, { align: "center" });
    doc.setFontSize(16);
    doc.text("OSHK Legal Information", 105, 45, { align: "center" });
    doc.addPage();

    // Add all sections
    let yPosition = 20; // Start position on page
    
    documentData.sections.forEach((section) => {
      // Add section title
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(section.title, 15, yPosition);
      yPosition += 10;
      
      // Add intro text if exists
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
      
      // Add section content (remove HTML tags but preserve basic formatting)
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
      
      yPosition += 10; // Extra space between sections
    });

    // Save the PDF
    doc.save(`OSHK-${documentType === "general_conditions" ? "General-Conditions" : "Legal-Notices"}.pdf`);
  };

  // Render section content dynamically
  const renderSection = (section, index) => {
    // Special handling for download section to add our button
    if (section.id === "download") {
      return (
        <section id={section.id} className="mb-12 w-full" key={section.id}>
          <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">These terms can be downloaded in PDF format from our website.</p>
            <button 
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Download PDF Version
            </button>
          </div>
        </section>
      );
    }

    return (
      <section id={section.id} className="mb-12 w-full" key={section.id}>
        <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
        {section.intro && <p className="mb-6 text-gray-700 leading-relaxed">{section.intro}</p>}
        {section.content && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
      </section>
    );
  };

  return (
    <div>
      <div className="w-full bg-gray-50  px-[-20px] lg:px-0">
        <div className="flex w-full flex-col md:flex-row gap-20">
          {/* Left column - Content sections */}
          <div className="flex-1">
            <div className="max-w-[1040px] mx-auto">
              <section id={documentData.sections[0].id} className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                  {documentData.sections[0].title}
                </h2>
                {documentData.sections[0].intro && (
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    {documentData.sections[0].intro}
                  </p>
                )}
                <div
                  className="editor-info bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  dangerouslySetInnerHTML={{
                    __html: documentData.sections[0].content,
                  }}
                />
              </section>

              <section id={documentData.sections[1].id} className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                  {documentData.sections[1].title}
                </h2>
                {documentData.sections[1].intro && (
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    {documentData.sections[1].intro}
                  </p>
                )}
                <div
                  className="owner-info bg-gradient-to-br from-gray-50 to-gray-100 mt-10 p-7 lg:h-[366px] rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                  dangerouslySetInnerHTML={{
                    __html: documentData.sections[1].content,
                  }}
                />
              </section>
            </div>

            {/* Render all other sections with full width */}
          </div>

          {/* Right column - Table of Contents (keeps original width) */}
          <div className="md:w-1/3 lg:w-2/5">
            <section className="top-4 mb-12 bg-gray-100 px-6 pt-4 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                TABLE OF CONTENTS
              </h2>
              <ul className="">
                {documentData.sections.map((section) => (
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
      <div className="w-full px-2 lg:px-4 text-justify">
        {documentData.sections.slice(2).map(renderSection)}
      </div>
    </div>
  );
}

export default Conditions;