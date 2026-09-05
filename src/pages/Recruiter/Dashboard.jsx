import { useEffect, useState } from "react";

import RecruiterLayout from "../../layouts/RecruiterLayout";
import RecruiterSummaryCard from "../../components/RecruiterSummaryCard";
import HiringCharts from "../../components/HiringCharts";
import RecentJobs from "../../components/RecentJobs";
import RecentApplicants from "../../components/RecentApplicants";
import QuickActions from "../../components/QuickActions";

import API from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    jobs_posted: 0,
    applicants: 0,
    shortlisted: 0,
    hired: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await API.get("/api/recruiter/dashboard");

        setStats({
          jobs_posted: response.data.jobs_posted || 0,
          applicants: response.data.applicants || 0,
          shortlisted: response.data.shortlisted || 0,
          hired: response.data.hired || 0,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <RecruiterLayout>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage job postings, applicants, and hiring performance.
        </p>
      </div>

      {/* Summary Cards */}
      <RecruiterSummaryCard
        stats={stats}
        loading={loading}
      />

      {/* Hiring Charts */}
      <div className="mt-8">
        <HiringCharts />
      </div>

      {/* Recent Jobs */}
      <div className="mt-8">
        <RecentJobs />
      </div>

      {/* Recent Applicants */}
      <div className="mt-8">
        <RecentApplicants />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

    </RecruiterLayout>
  );
}