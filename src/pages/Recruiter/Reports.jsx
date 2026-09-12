import { useEffect, useState } from "react";

import RecruiterLayout from "../../layouts/RecruiterLayout";
import RecruiterReportSummaryCard from "../../components/RecruiterReportSummaryCard";
import RecruiterReportCharts from "../../components/RecruiterReportCharts";
import RecruiterAIInsights from "../../components/RecruiterAIInsights";

import { FaDownload } from "react-icons/fa";

import API from "../../api/axios";

export default function Reports() {
  const [stats, setStats] = useState({
    jobs_posted: 0,
    applicants: 0,
    shortlisted: 0,
    hired: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const response = await API.get("/api/recruiter/dashboard");

        setStats({
          jobs_posted: response.data.jobs_posted || 0,
          applicants: response.data.applicants || 0,
          shortlisted: response.data.shortlisted || 0,
          hired: response.data.hired || 0,
        });
      } catch (error) {
        console.error("Report statistics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportStats();
  }, []);

  const handleDownloadReport = () => {
    window.print();
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
      <RecruiterReportSummaryCard
        stats={stats}
        loading={loading}
      />

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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition"
        >
          <FaDownload />

          Download Recruitment Report
        </button>

      </div>

    </RecruiterLayout>
  );
}