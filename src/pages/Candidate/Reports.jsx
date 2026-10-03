import { useEffect, useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { FaDownload } from "react-icons/fa";
import PerformanceSummaryCard from "../../components/PerformanceSummaryCard";
import PerformanceCharts from "../../components/PerformanceCharts";
import AchievementCard from "../../components/AchievementCard";
import RecentActivityCard from "../../components/RecentActivityCard";
import AIInsightsCard from "../../components/AIInsightsCard";
import API from "../../api/axios";

export default function Reports() {

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH REPORT DATA
  // =========================================================

  useEffect(() => {

    const fetchReports = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/candidate/reports"
        );

        console.log(
          "Candidate Reports Response:",
          response.data
        );

        if (response.data.success) {

          setReportData(response.data);

        } else {

          setError(
            response.data.message ||
            "Failed to load reports."
          );

        }

      } catch (error) {

        console.error(
          "Reports API error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load reports."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchReports();

  }, []);


  // =========================================================
  // DOWNLOAD PDF REPORT
  // =========================================================

  const handleDownloadPDF = async () => {

    try {

      const response = await API.get(
        "/api/candidate/reports/pdf",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        )
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "Candidate_Report.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(
        "PDF download error:",
        error
      );

      alert(
        "Failed to download PDF report."
      );

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <CandidateLayout>

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Reports & Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Track your overall performance
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-8">

          <p className="text-gray-500">
            Loading reports...
          </p>

        </div>

      </CandidateLayout>
    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <CandidateLayout>

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Reports & Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Track your overall performance
          </p>

        </div>

        <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-5">

          {error}

        </div>

      </CandidateLayout>
    );

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <CandidateLayout>

      {/* Page Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Reports & Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Track your overall performance
        </p>

      </div>


      {/* Overall Performance */}

      <PerformanceSummaryCard
        data={reportData?.metrics}
      />


      {/* Charts */}

      <div className="mt-8">

        <PerformanceCharts
          data={reportData?.charts}
        />

      </div>


      {/* AI Insights */}

      <div className="mt-8">

        <AIInsightsCard
          insights={reportData?.insights}
        />

      </div>


      {/* Achievements */}

      <div className="mt-8">

        <AchievementCard
          achievements={reportData?.achievements}
        />

      </div>


      {/* Recent Activity */}

      <div className="mt-8">

        <RecentActivityCard
          activities={reportData?.activities}
        />

      </div>


      {/* Download Button */}

      <div className="mt-8 flex justify-end">

        <button
          onClick={handleDownloadPDF}
          className="
          flex items-center gap-3
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-xl
          shadow-md
          hover:shadow-xl
          transition-all
          duration-300
          hover:-translate-y-1
         "
        >

          <FaDownload className="text-lg" />

          <span className="font-semibold">
            Download PDF Report
          </span>

        </button>

      </div>

    </CandidateLayout>
  );

}