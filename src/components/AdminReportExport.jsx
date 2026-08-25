import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdminReportExport({ reportRef }) {
  const exportPDF = async () => {
    const element = reportRef.current;

    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imageData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save("admin-report.pdf");
  };

  return (
    <button
      onClick={exportPDF}
      className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
    >
      Export PDF
    </button>
  );
}