import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaUserTie,
  FaCheckCircle,
  FaChartLine,
  FaDownload,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminReports() {
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

// =========================================================
// DOWNLOAD ADMIN REPORT
// =========================================================

const handleDownloadReport = async () => {
  try {
    setDownloading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://127.0.0.1:5000/api/admin/reports/download",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("ADMIN REPORT ERROR:", errorText);

      throw new Error("Unable to download admin report");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Admin_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Admin report download error:", error);

    alert("Unable to download admin report.");
  } finally {
    setDownloading(false);
  }
};

  // =========================================================
  // FETCH ADMIN REPORT DATA
  // =========================================================

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch admin report data"
          );
        }

        const data = await response.json();

        console.log("ADMIN REPORT DATA:", data);

        setReport(data);
      } catch (error) {
        console.error(
          "Admin reports error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500 text-lg">
            Loading reports...
          </p>
        </div>
      </AdminLayout>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load reports
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>
        </div>
      </AdminLayout>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const overview = report?.overview || {};

  const userGrowth = report?.user_growth || [];

  const recruitmentPerformance =
    report?.recruiter_performance ||
    report?.recruitment_performance ||
    [];

  // =========================================================
  // SUMMARY CARDS
  // =========================================================

  const cards = [
    {
      title: "Total Users",
      value: overview.total_users || 0,
      icon: FaUsers,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Applications",
      value: overview.total_applications || 0,
      icon: FaFileAlt,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },

    {
      title: "Total Jobs",
      value: overview.total_jobs || 0,
      icon: FaBriefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Interviews",
      value: overview.total_interviews || 0,
      icon: FaUserTie,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Total Hires",
      value: overview.total_hired || 0,
      icon: FaCheckCircle,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

    {
      title: "Hiring Rate",
      value: `${overview.hiring_rate || 0}%`,
      icon: FaChartLine,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AdminLayout>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">

        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-2xl
                shadow-sm
                border border-gray-100
                p-8
                flex
                items-center
                justify-between
                min-h-[140px]
              "
            >

              {/* CARD TEXT */}

              <div>
                <p className="text-gray-500 text-base font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-3">
                  {card.value}
                </h2>
              </div>

              {/* CARD ICON */}

              <div
                className={`
                  ${card.iconBg}
                  ${card.iconColor}
                  w-16
                  h-16
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-2xl
                `}
              >
                <Icon />
              </div>

            </div>
          );
        })}

      </div>


      {/* =====================================================
          RECRUITMENT OVERVIEW
      ===================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Recruitment Overview
        </h1>

        <p className="text-gray-500 mt-2 text-base">
          Analyze applications and hiring performance across the platform.
        </p>

      </div>


      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">


        {/* ===================================================
            USER GROWTH
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border border-gray-100
            p-8
            min-h-[480px]
          "
        >

          <h2 className="text-2xl font-bold text-gray-900">
            User Growth
          </h2>

          <p className="text-gray-500 mt-2">
            Monthly growth of users across the platform.
          </p>

          <div className="mt-8 h-[330px]">

            {userGrowth.length === 0 ? (

              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-lg">
                  No user growth data available.
                </p>
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={userGrowth}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>


        {/* ===================================================
            RECRUITMENT PERFORMANCE
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border border-gray-100
            p-8
            min-h-[480px]
          "
        >

          <h2 className="text-2xl font-bold text-gray-900">
            Recruitment Performance
          </h2>

          <p className="text-gray-500 mt-2">
            Applications, interviews, and hires over time.
          </p>

          <div className="mt-8 h-[330px]">

            {recruitmentPerformance.length === 0 ? (

              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-lg">
                  No recruitment data available.
                </p>
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={recruitmentPerformance}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="interviews"
                    name="Interviews"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="hires"
                    name="Hires"
                    stroke="#9333ea"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          DOWNLOAD REPORT
      ===================================================== */}
<div className="flex justify-end mt-8 mb-6">
  <button
    onClick={handleDownloadReport}
    disabled={downloading}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
      downloading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    <FaDownload />
    {downloading ? "Generating..." : "Download Report"}
  </button>
</div>

    </AdminLayout>
  );
}