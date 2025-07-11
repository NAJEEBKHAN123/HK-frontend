import React from "react";
import { jsPDF } from "jspdf";
import CommonLegalInfo from "./CommonLegalInfo";

function LegalNotices({ documentType = "legal_notices" }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Legal Notices", 105, 30, { align: "center" });
    doc.setFontSize(16);
    doc.text("OSHK Legal Information", 105, 45, { align: "center" });
    doc.addPage();

    let yPosition = 20;

    sections.forEach((section) => {
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(section.title, 15, yPosition);
      yPosition += 10;

      // Extract text content from JSX elements
      let cleanContent = "";
      if (typeof section.content === "string") {
        cleanContent = section.content;
      } else if (section.content.props.children) {
        if (Array.isArray(section.content.props.children)) {
          cleanContent = section.content.props.children
            .map(child => typeof child === 'string' ? child : '')
            .join(' ');
        } else {
          cleanContent = section.content.props.children;
        }
      }

      cleanContent = cleanContent
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

    doc.save("OSCHK-Legal-Notices.pdf");
  };

 const sections = [
    {
      id: "company-info",
      title: "1. Company Information",
      content: (
        <ul className="space-y-3 text-gray-700 mt-10">
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-40 flex-shrink-0">
              Company Name:
            </strong>
            <span>Create Company Hongkong LCLS LIMITED</span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-40 flex-shrink-0">
              Address:
            </strong>
            <span>
              203 - 2/F, UPPER OFFICES HANKOW CTR, 5-15 HANKOW RD TSIM SHA TSUI,
              HONG KONG
            </span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-40 flex-shrink-0">
              Phone Number:
            </strong>
            <span>+40 364 566 777</span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-40 flex-shrink-0">
              Email Address:
            </strong>
            <span>bonjour@ouvrir-societe-hong-kong.fr</span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-40 flex-shrink-0">
              Company Reg No:
            </strong>
            <span>78164472-000-05-25-0</span>
          </li>
        </ul>
      ),
    },
    {
      id: "publication-director",
      title: "2. Publication Director",
      content: (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
              Name:
            </strong>
            <span>Najeeb Ullah</span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
              Address:
            </strong>
            <span>
              Str. Forest bazar near agriculture University, Peshawar, Pakistan
            </span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
              Phone Number:
            </strong>
            <span>+92 308 8440 190</span>
          </li>
        </ul>
      ),
    },
    {
      id: "hosting-provider",
      title: "3. Hosting Provider",
      content: (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
              Hosting Provider Name:
            </strong>
            <span>Hosterion</span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
              Address:
            </strong>
            <span>Str. Eugen Ionesco 49 F, Cluj-Napoca, Romania</span>
          </li>
          <li className="flex items-start">
            <strong className="text-gray-900 font-medium w-48 mr-2 flex-shrink-0">
              Phone Number:
            </strong>
            <span>+40 364 566 777</span>
          </li>
        </ul>
      ),
    },
    {
      id: "intellectual-property",
      title: "4. Intellectual Property",
      content: (
        <p className="text-gray-700">
          All content on this site is protected by Hong Kong's intellectual
          property laws. Reproduction, distribution, or use of the content
          without prior permission is prohibited.
        </p>
      ),
    },
    {
      id: "data-protection",
      title: "5. Data Protection",
      content: (
        <p className="text-gray-700">
          Information collected via this site may include name, email address, and
          other contact details necessary for customer service. We are committed
          to respecting data privacy in accordance with Hong Kong's Personal Data
          (Privacy) Ordinance.
        </p>
      ),
    },
    {
      id: "cookies-usage",
      title: "6. Cookies Usage",
      content: (
        <p className="text-gray-700">
          This site uses cookies to enhance user experience. By continuing to
          browse, you accept the use of cookies. You can manage cookie
          preferences through your browser.
        </p>
      ),
    },
    {
      id: "liability-limitations",
      title: "7. Liability Limitations",
      content: (
        <p className="text-gray-700">
          This site may contain links to external websites. We are not responsible
          for the content or practices of these sites.
        </p>
      ),
    },
    {
      id: "applicable-law",
      title: "8. Applicable Law and Jurisdiction",
      content: (
        <p className="text-gray-700">
          This legal notice is governed by the laws of Hong Kong. In case of
          disputes, the courts of Hong Kong will have exclusive jurisdiction.
        </p>
      ),
    },
    {
      id: "download",
      title: "9. Download",
      content: (
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-4">
            These terms can be downloaded in PDF format from our website.
          </p>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download PDF Version
          </button>
        </div>
      ),
    },
  ];

  const renderSection = (section) => {
    if (section.id === "download") {
      return (
        <section id={section.id} className="mb-12 w-full" key={section.id}>
          <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
          {section.content}
        </section>
      );
    }

    return (
      <section id={section.id} className="mb-12 w-full" key={section.id}>
        <h2 className="text-2xl font-bold mb-4 w-full">{section.title}</h2>
        <div className="w-full">{section.content}</div>
      </section>
    );
  };

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
                TABLE OF CONTENTS
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