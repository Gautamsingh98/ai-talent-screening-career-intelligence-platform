import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSummaryCard from "../../components/AdminSummaryCard";
import AdminCharts from "../../components/AdminCharts";
import AdminRecentUsers from "../../components/AdminRecentUsers";
import AdminRecentActivity from "../../components/AdminRecentActivity";
import AdminDashboardCharts from "../../components/AdminDashboardCharts";

export default function AdminDashboard() {

  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN DASHBOARD
  // =====================================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);

        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch admin dashboard"
          );

        }

        setDashboard(data);

      } catch (err) {

        console.error(
          "Admin dashboard error:",
          err
        );

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <AdminLayout>

        <div className="flex justify-center items-center min-h-[500px]">

          <div className="text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading admin dashboard...
            </p>

          </div>

        </div>

      </AdminLayout>
    );

  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <AdminLayout>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">

          <h2 className="font-semibold text-lg">
            Unable to load dashboard
          </h2>

          <p className="mt-2">
            {error}
          </p>

        </div>

      </AdminLayout>
    );

  }

  // =====================================================
  // OVERVIEW DATA
  // =====================================================

  const overview =
    dashboard?.overview || {};

  // =====================================================
  // UI
  // =====================================================

  return (

    <AdminLayout>

      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">

          Welcome to Admin Dashboard

        </h1>

        <p className="text-gray-500 mt-2">

          Monitor and manage the AI Talent Screening platform.

        </p>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <AdminSummaryCard
        totalUsers={overview.total_users || 0}
        totalCandidates={
          overview.total_candidates || 0
        }
        totalRecruiters={
          overview.total_recruiters || 0
        }
        totalJobs={
          overview.total_jobs || 0
        }
        totalApplications={
          overview.total_applications || 0
        }
        totalHired={
          overview.total_hired || 0
        }
      />


      {/* =================================================
          CHARTS
      ================================================= */}

      <AdminCharts
        overview={overview}
      />


      {/* =================================================
          RECENT USERS
      ================================================= */}

      <AdminRecentUsers />


      {/* =================================================
          RECENT ACTIVITY
      ================================================= */}

      <AdminRecentActivity />


      {/* =================================================
          DASHBOARD CHARTS
      ================================================= */}

      <AdminDashboardCharts
        overview={overview}
      />

    </AdminLayout>
  );
}