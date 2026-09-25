import { useState } from "react";

import RecruiterLayout from "../../layouts/RecruiterLayout";
import RecruiterReportSummaryCard from "../../components/RecruiterReportSummaryCard";
import RecruiterReportCharts from "../../components/RecruiterReportCharts";
import RecruiterAIInsights from "../../components/RecruiterAIInsights";

import { FaDownload } from "react-icons/fa";

export default function Reports() {

  const [downloading, setDownloading] = useState(false);

  // =====================================================
  // DOWNLOAD RECRUITMENT REPORT
  // =====================================================

  const handleDownloadReport = async () => {

    try {

      setDownloading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/recruiter/reports/download",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "Recruiter_Recruitment_Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error("Download error:", error);

      alert("Failed to download recruitment report.");

    } finally {

      setDownloading(false);

    }
  };

  return (

    <RecruiterLayout>

      {/* Page Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Recruiter Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Track hiring performance and recruitment statistics.
        </p>

      </div>


      {/* Summary Cards */}

      <RecruiterReportSummaryCard />


      {/* Charts */}

      <div className="mt-8">
        <RecruiterReportCharts />
      </div>


      {/* AI Insights */}

      <div className="mt-8">
        <RecruiterAIInsights />
      </div>


      {/* Download Button */}

      <div className="mt-8 flex justify-end">

        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition"
        >

          <FaDownload />

          {downloading
            ? "Generating Report..."
            : "Download Recruitment Report"
          }

        </button>

      </div>

    </RecruiterLayout>
  );
}