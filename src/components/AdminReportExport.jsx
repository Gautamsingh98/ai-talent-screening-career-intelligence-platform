import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { FaFilePdf } from "react-icons/fa";

export default function AdminReportExport({ reportRef }) {

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {

    if (!reportRef?.current) {
      alert("Report content is not available.");
      return;
    }

    try {

      setExporting(true);

      const reportElement = reportRef.current;

      // =====================================================
      // CREATE CANVAS
      // =====================================================

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f8fafc",
        logging: false,
      });

      // =====================================================
      // CREATE PDF
      // =====================================================

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // =====================================================
      // PDF DIMENSIONS
      // =====================================================

      const pdfWidth = 210;
      const pdfHeight = 297;

      const margin = 10;

      const contentWidth = pdfWidth - margin * 2;

      const imageHeight =
        (canvas.height * contentWidth) / canvas.width;

      // =====================================================
      // REPORT HEADER
      // =====================================================

      pdf.setFillColor(30, 64, 175);

      pdf.rect(
        0,
        0,
        pdfWidth,
        25,
        "F"
      );

      pdf.setTextColor(255, 255, 255);

      pdf.setFontSize(18);

      pdf.setFont("helvetica", "bold");

      pdf.text(
        "AI Talent Screening Platform",
        margin,
        11
      );

      pdf.setFontSize(10);

      pdf.setFont("helvetica", "normal");

      pdf.text(
        "Admin Recruitment Report",
        margin,
        18
      );

      // =====================================================
      // GENERATED DATE
      // =====================================================

      const currentDate = new Date();

      const formattedDate =
        currentDate.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

      pdf.text(
        `Generated: ${formattedDate}`,
        pdfWidth - margin - 45,
        18
      );

      // =====================================================
      // ADD REPORT IMAGE
      // =====================================================

      let positionY = 32;

      let remainingHeight = imageHeight;

      let sourceY = 0;

      const firstPageHeight =
        pdfHeight - positionY - margin;

      // First page

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        positionY,
        contentWidth,
        imageHeight
      );

      remainingHeight =
        imageHeight - firstPageHeight;

      sourceY =
        firstPageHeight;

      // =====================================================
      // ADD ADDITIONAL PAGES
      // =====================================================

      while (remainingHeight > 0) {

        pdf.addPage();

        positionY = margin;

        const pageCanvas = document.createElement("canvas");

        const pageContext =
          pageCanvas.getContext("2d");

        const sourceHeight =
          Math.min(
            firstPageHeight,
            remainingHeight
          );

        pageCanvas.width =
          canvas.width;

        pageCanvas.height =
          (sourceHeight / contentWidth) *
          canvas.width;

        pageContext.drawImage(
          canvas,
          0,
          sourceY *
            (canvas.width / contentWidth),
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );

        const pageImage =
          pageCanvas.toDataURL("image/png");

        const pageImageHeight =
          (pageCanvas.height * contentWidth) /
          pageCanvas.width;

        pdf.addImage(
          pageImage,
          "PNG",
          margin,
          positionY,
          contentWidth,
          pageImageHeight
        );

        remainingHeight -= sourceHeight;

        sourceY += sourceHeight;
      }

      // =====================================================
      // PAGE NUMBERS
      // =====================================================

      const totalPages =
        pdf.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {

        pdf.setPage(page);

        pdf.setFontSize(8);

        pdf.setTextColor(120, 120, 120);

        pdf.text(
          `Admin Recruitment Report | Page ${page} of ${totalPages}`,
          pdfWidth / 2,
          pdfHeight - 5,
          {
            align: "center",
          }
        );
      }

      // =====================================================
      // DOWNLOAD
      // =====================================================

      pdf.save(
        "Admin_Recruitment_Report.pdf"
      );

    } catch (error) {

      console.error(
        "PDF export error:",
        error
      );

      alert(
        "Failed to generate PDF report."
      );

    } finally {

      setExporting(false);

    }
  };

  return (
    <button
      onClick={handleExportPDF}
      disabled={exporting}
      className="
        flex
        items-center
        gap-2
        px-5
        py-3
        rounded-lg
        bg-blue-600
        text-white
        font-medium
        shadow-sm
        hover:bg-blue-700
        disabled:bg-blue-400
        disabled:cursor-not-allowed
        transition
      "
    >

      <FaFilePdf />

      {exporting
        ? "Generating PDF..."
        : "Export PDF"
      }

    </button>
  );
}