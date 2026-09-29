import { useEffect, useState } from "react";

import {
  FaUsers,
  FaUserGraduate,
  FaUserTie,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaUserClock,
  FaChartLine,
} from "react-icons/fa";

export default function AdminAnalyticsSummaryCards() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/analytics",
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

        setAnalytics(data.overview);
      } catch (error) {
        console.error("Admin analytics error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="font-semibold text-red-600">
          Failed to load analytics
        </p>

        <p className="text-red-500 mt-1">
          {error}
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: analytics?.total_users ?? 0,
      growth: analytics?.growth?.users ?? 0,
      icon: FaUsers,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Candidates",
      value: analytics?.total_candidates ?? 0,
      growth: analytics?.growth?.candidates ?? 0,
      icon: FaUserGraduate,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Recruiters",
      value: analytics?.total_recruiters ?? 0,
      growth: analytics?.growth?.recruiters ?? 0,
      icon: FaUserTie,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Active Jobs",
      value: analytics?.total_jobs ?? 0,
      growth: analytics?.growth?.jobs ?? 0,
      icon: FaBriefcase,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Applications",
      value: analytics?.total_applications ?? 0,
      growth: analytics?.growth?.applications ?? 0,
      icon: FaFileAlt,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },

    {
      title: "Total Hires",
      value: analytics?.total_hired ?? 0,
      growth: analytics?.growth?.hired ?? 0,
      icon: FaCheckCircle,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

    {
      title: "Interviews",
      value: analytics?.total_interviews ?? 0,
      growth: analytics?.growth?.interviews ?? 0,
      icon: FaUserClock,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },

    {
      title: "Hiring Rate",
      value: `${analytics?.hiring_rate ?? 0}%`,
      growth: null,
      icon: FaChartLine,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
          >

            <div>
              <p className="text-gray-500 text-sm font-medium">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {card.value}
              </h2>

              {/* DYNAMIC GROWTH */}
              {card.growth !== null && (
                <p
                  className={`text-sm font-medium mt-2 ${
                    card.growth > 0
                      ? "text-green-600"
                      : card.growth < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {card.growth > 0 ? "+" : ""}
                  {card.growth}%
                  <span className="text-gray-400 ml-1">
                    vs previous period
                  </span>
                </p>
              )}
            </div>

            <div
              className={`${card.iconBg} ${card.iconColor} w-16 h-16 rounded-full flex items-center justify-center text-2xl`}
            >
              <Icon />
            </div>

          </div>
        );
      })}

    </div>
  );
}