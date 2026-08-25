import { useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import AdminAnalyticsSummaryCards from "../../components/AdminAnalyticsSummaryCards";
import AdminAnalyticsCharts from "../../components/AdminAnalyticsCharts";
import AdminAnalyticsInsights from "../../components/AdminAnalyticsInsights";
import AdminTopPerformers from "../../components/AdminTopPerformers";
import AdminRecentActivity from "../../components/AdminRecentActivity";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months");

  return (
    <AdminLayout>

      {/* Page Heading + Filter */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Analyze platform activity, users, jobs, and recruitment performance.
          </p>

        </div>

        {/* Time Filter */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >

          <option value="7days">
            Last 7 Days
          </option>

          <option value="30days">
            Last 30 Days
          </option>

          <option value="6months">
            Last 6 Months
          </option>

          <option value="year">
            This Year
          </option>

        </select>

      </div>

      {/* Summary Cards */}
      <AdminAnalyticsSummaryCards />

      {/* Charts */}
      <AdminAnalyticsCharts timeRange={timeRange} />

      {/* Insights */}
      <AdminAnalyticsInsights />

      {/* Top Performers */}
      <AdminTopPerformers />

      {/* Recent Activity */}
      <AdminRecentActivity />

    </AdminLayout>
  );
}