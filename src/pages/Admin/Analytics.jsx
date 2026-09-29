import { useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import AdminAnalyticsSummaryCards from "../../components/AdminAnalyticsSummaryCards";
import AdminAnalyticsCharts from "../../components/AdminAnalyticsCharts";
import AdminAnalyticsInsights from "../../components/AdminAnalyticsInsights";
import AdminTopPerformers from "../../components/AdminTopPerformers";


export default function AdminAnalytics() {

  const [timeRange, setTimeRange] = useState("6months");


  return (

    <AdminLayout>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Admin Analytics
            </h1>

            <p className="text-gray-500 mt-2">
              Analyze platform activity, users, jobs, and recruitment performance.
            </p>

          </div>


          {/* =================================================
              TIME RANGE
          ================================================= */}

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <AdminAnalyticsSummaryCards />


      {/* =====================================================
          CHARTS
      ===================================================== */}

      <AdminAnalyticsCharts
        timeRange={timeRange}
      />


      {/* =====================================================
          ANALYTICS INSIGHTS
      ===================================================== */}

      <AdminAnalyticsInsights />


      {/* =====================================================
          TOP PERFORMERS
      ===================================================== */}

      <AdminTopPerformers />

    </AdminLayout>

  );
}