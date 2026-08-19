import RecruiterLayout from "../../layouts/RecruiterLayout";
import RecruiterReportSummaryCard from "../../components/RecruiterReportSummaryCard";
import RecruiterReportCharts from "../../components/RecruiterReportCharts";
import RecruiterAIInsights from "../../components/RecruiterAIInsights";
import { FaDownload } from "react-icons/fa";
export default function Reports() {
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

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition">

          <FaDownload />

          Download Recruitment Report

        </button>

      </div>

    </RecruiterLayout>
  );
}