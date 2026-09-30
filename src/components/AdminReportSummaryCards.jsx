import { useEffect, useState } from "react";

import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaUserTie,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

export default function AdminReportSummaryCards() {

  const [report, setReport] = useState({
    total_users: 0,
    total_jobs: 0,
    total_applications: 0,
    total_interviews: 0,
    total_hired: 0,
    hiring_rate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH REPORT DATA
  // =====================================================

  const fetchReportData = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message || "Failed to fetch report data"
        );

      }

      setReport({
        total_users:
          data.overview?.total_users || 0,

        total_jobs:
          data.overview?.total_jobs || 0,

        total_applications:
          data.overview?.total_applications || 0,

        total_interviews:
          data.overview?.total_interviews || 0,

        total_hired:
          data.overview?.total_hired || 0,

        hiring_rate:
          data.overview?.hiring_rate || 0,
      });

    } catch (error) {

      console.error(
        "Admin report error:",
        error
      );

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    fetchReportData();

  }, []);


  // =====================================================
  // CARD DATA
  // =====================================================

  const cards = [

    {
      title: "Total Users",
      value: report.total_users,
      icon: <FaUsers />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    {
      title: "Total Jobs",
      value: report.total_jobs,
      icon: <FaBriefcase />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    {
      title: "Applications",
      value: report.total_applications,
      icon: <FaFileAlt />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },

    {
      title: "Interviews",
      value: report.total_interviews,
      icon: <FaUserTie />,
      bg: "bg-green-100",
      color: "text-green-600",
    },

    {
      title: "Total Hires",
      value: report.total_hired,
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },

    {
      title: "Hiring Rate",
      value: `${report.hiring_rate}%`,
      icon: <FaChartLine />,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },

  ];


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">

        <p className="font-semibold text-red-600">
          Failed to load report summary
        </p>

        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>

        <button
          onClick={fetchReportData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>

      </div>
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {cards.map((card, index) => (

        <div
          key={index}
          className="
            bg-white
            rounded-xl
            shadow-sm
            border
            border-gray-100
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            {/* CARD INFORMATION */}

            <div>

              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              {loading ? (

                <div className="mt-3 h-9 w-20 bg-gray-200 rounded animate-pulse"></div>

              ) : (

                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h3>

              )}

            </div>


            {/* ICON */}

            <div
              className={`
                w-14
                h-14
                rounded-full
                flex
                items-center
                justify-center
                text-xl
                ${card.bg}
                ${card.color}
              `}
            >

              {card.icon}

            </div>

          </div>

        </div>

      ))}

    </div>

  );
}