import { useEffect, useState } from "react";

import {
  FaArrowUp,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminAnalyticsInsights() {

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

        console.log("ADMIN ANALYTICS INSIGHTS:", data);

        setAnalytics(data.overview);

      } catch (error) {

        console.error(
          "Admin analytics insights error:",
          error
        );

        setError(error.message);

      } finally {

        setLoading(false);

      }
    };

    fetchAnalytics();

  }, []);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

        <p className="text-gray-500">
          Loading analytics insights...
        </p>

      </div>
    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">

        <p className="font-semibold text-red-600">
          Failed to load analytics insights
        </p>

        <p className="text-red-500 mt-1">
          {error}
        </p>

      </div>
    );

  }


  // =========================================================
  // REAL BACKEND VALUES
  // =========================================================

  const growth = analytics?.growth || {};

  const userGrowth = Number(growth.users || 0);

  const candidateGrowth = Number(
    growth.candidates || 0
  );

  const applicationGrowth = Number(
    growth.applications || 0
  );

  const hiringRate = Number(
    analytics?.hiring_rate || 0
  );

  const totalJobs = Number(
    analytics?.total_jobs || 0
  );


  // =========================================================
  // FORMAT GROWTH
  // =========================================================

  const formatGrowth = (value) => {

    if (value > 0) {
      return `+${value}%`;
    }

    if (value < 0) {
      return `${value}%`;
    }

    return "0%";

  };


  // =========================================================
  // INSIGHTS
  // =========================================================

  const insights = [

    {
      title: "User Growth",

      value: formatGrowth(userGrowth),

      icon: FaArrowUp,

      iconBg: "bg-blue-100",

      iconColor: "text-blue-600",

      valueColor: "text-blue-600",

      description:
        userGrowth > 0
          ? "Total platform users increased compared to the previous period."
          : userGrowth < 0
          ? "Total platform users decreased compared to the previous period."
          : "Total platform users remained unchanged compared to the previous period.",
    },


    {
      title: "Candidate Growth",

      value: formatGrowth(candidateGrowth),

      icon: FaUsers,

      iconBg: "bg-green-100",

      iconColor: "text-green-600",

      valueColor: "text-green-600",

      description:
        candidateGrowth > 0
          ? "Candidate registrations are increasing compared to the previous period."
          : candidateGrowth < 0
          ? "Candidate registrations decreased compared to the previous period."
          : "Candidate registrations remained unchanged compared to the previous period.",
    },


    {
      title: "Job Activity",

      value: totalJobs,

      icon: FaBriefcase,

      iconBg: "bg-blue-100",

      iconColor: "text-blue-600",

      valueColor: "text-blue-600",

      description:
        "Total jobs currently available on the platform.",
    },


    {
      title: "Applications",

      value: formatGrowth(applicationGrowth),

      icon: FaFileAlt,

      iconBg: "bg-yellow-100",

      iconColor: "text-yellow-600",

      valueColor: "text-yellow-600",

      description:
        applicationGrowth > 0
          ? "Applications increased compared to the previous period."
          : applicationGrowth < 0
          ? "Applications decreased compared to the previous period."
          : "Applications remained unchanged compared to the previous period.",
    },


    {
      title: "Hiring Performance",

      value: `${hiringRate}%`,

      icon: FaCheckCircle,

      iconBg: "bg-green-100",

      iconColor: "text-green-600",

      valueColor: "text-green-600",

      description:
        "Current overall platform hiring rate.",
    },

  ];


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="bg-white rounded-xl shadow-md p-6 mb-8">

      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Analytics Insights
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {insights.map((insight, index) => {

          const Icon = insight.icon;

          return (

            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6"
            >

              {/* TOP */}

              <div className="flex items-center justify-between">

                <div
                  className={`${insight.iconBg} ${insight.iconColor} w-16 h-16 rounded-full flex items-center justify-center text-xl`}
                >

                  <Icon />

                </div>


                <span
                  className={`text-2xl font-bold ${insight.valueColor}`}
                >

                  {insight.value}

                </span>

              </div>


              {/* TITLE */}

              <h3 className="text-2xl font-semibold text-gray-800 mt-8">

                {insight.title}

              </h3>


              {/* DESCRIPTION */}

              <p className="text-gray-500 mt-4">

                {insight.description}

              </p>

            </div>

          );

        })}

      </div>

    </div>

  );

}