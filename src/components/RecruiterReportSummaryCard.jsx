import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaUsers,
  FaUserCheck,
  FaChartLine,
} from "react-icons/fa";

export default function RecruiterReportSummaryCard() {

  const [report, setReport] = useState({
    total_jobs: 0,
    total_applications: 0,
    hired: 0,
    success_rate: 0,
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH RECRUITER REPORT SUMMARY
  // =====================================================

  useEffect(() => {

    const fetchReportSummary = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/recruiter/reports",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {

          const errorData = await response.json();

          console.error(
            "Failed to fetch recruiter report:",
            errorData
          );

          throw new Error(
            errorData.message || "Failed to fetch report"
          );
        }

        const data = await response.json();

        console.log("Recruiter report data:", data);

        setReport({
          total_jobs: data.total_jobs || 0,
          total_applications: data.total_applications || 0,
          hired: data.hired || 0,
          success_rate: data.success_rate || 0,
        });

      } catch (error) {

        console.error(
          "Error fetching recruiter report summary:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchReportSummary();

  }, []);

  // =====================================================
  // SUMMARY CARDS
  // =====================================================

  const cards = [
    {
      title: "Jobs Posted",
      value: loading ? "..." : report.total_jobs,
      icon: <FaBriefcase />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Applications",
      value: loading ? "..." : report.total_applications,
      icon: <FaUsers />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Hired",
      value: loading ? "..." : report.hired,
      icon: <FaUserCheck />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Success Rate",
      value: loading
        ? "..."
        : `${report.success_rate}%`,
      icon: <FaChartLine />,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {cards.map((card, index) => (

        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
        >

          {/* LEFT SIDE */}

          <div>

            <p className="text-gray-500 font-normal">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold mt-3">
              {card.value}
            </h2>

          </div>

          {/* RIGHT SIDE */}

          <div
            className={`w-16 h-16 rounded-full ${card.bg} flex items-center justify-center`}
          >

            <div
              className={`text-xl ${card.iconColor}`}
            >
              {card.icon}
            </div>

          </div>

        </div>

      ))}

    </div>

  );
}