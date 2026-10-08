import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import AdminAnalyticsSummaryCards from "../../components/AdminAnalyticsSummaryCards";
import AdminAnalyticsCharts from "../../components/AdminAnalyticsCharts";
import AdminAnalyticsInsights from "../../components/AdminAnalyticsInsights";
import AdminTopPerformers from "../../components/AdminTopPerformers";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months");

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://127.0.0.1:5000/api/admin/analytics?timeRange=${timeRange}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();

        console.log("ADMIN ANALYTICS:", data);

        setAnalytics(data);
      } catch (error) {
        console.error("Analytics error:", error);
        setError("Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Analytics
            </h1>

            <p className="text-gray-500 mt-2">
              Analyze platform activity, users, jobs, and recruitment
              performance.
            </p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500">
          Loading analytics...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {!loading && analytics && (
        <>
          <AdminAnalyticsSummaryCards
            totalUsers={analytics?.overview?.total_users || 0}
            totalCandidates={analytics?.overview?.total_candidates || 0}
            totalRecruiters={analytics?.overview?.total_recruiters || 0}
            totalJobs={analytics?.overview?.total_jobs || 0}
            totalApplications={
              analytics?.overview?.total_applications || 0
            }
            totalHired={analytics?.overview?.total_hired || 0}
          />

          <AdminAnalyticsCharts timeRange={timeRange} />

          <AdminAnalyticsInsights />

          <AdminTopPerformers />
        </>
      )}
    </AdminLayout>
  );
}