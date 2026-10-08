import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminAnalyticsCharts({ timeRange }) {
  const [userGrowth, setUserGrowth] = useState([]);
  const [recruitmentPerformance, setRecruitmentPerformance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Admin authorization token not found");
        }

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
          const errorData = await response.json().catch(() => ({}));

          throw new Error(
            errorData.message || "Failed to fetch analytics data"
          );
        }

        const data = await response.json();

        console.log("ADMIN ANALYTICS CHART DATA:", data);

        setUserGrowth(data.user_growth || []);

        setRecruitmentPerformance(
          data.recruitment_performance || []
        );

      } catch (error) {
        console.error(
          "Admin analytics charts error:",
          error
        );

        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();

  }, [timeRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-md p-6 h-96 flex items-center justify-center">
          <p className="text-gray-500">
            Loading user growth...
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-96 flex items-center justify-center">
          <p className="text-gray-500">
            Loading recruitment performance...
          </p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">

        <p className="font-semibold text-red-600">
          Failed to load analytics charts
        </p>

        <p className="text-red-500 mt-1">
          {error}
        </p>

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

      {/* =====================================================
          USER GROWTH
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-gray-800">
            User Growth
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            User registrations for the selected time period
          </p>

        </div>

        <div className="w-full h-80">

          {userGrowth.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No user growth data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={userGrowth}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 7 }}
                />

              </LineChart>

            </ResponsiveContainer>
          )}

        </div>

      </div>


      {/* =====================================================
          RECRUITMENT PERFORMANCE
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-gray-800">
            Recruitment Performance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Applications, interviews, and hires for the selected time period
          </p>

        </div>

        <div className="w-full h-80">

          {recruitmentPerformance.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No recruitment data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={recruitmentPerformance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="applications"
                  name="Applications"
                  fill="#3b82f6"
                />

                <Bar
                  dataKey="interviews"
                  name="Interviews"
                  fill="#8b5cf6"
                />

                <Bar
                  dataKey="hires"
                  name="Hires"
                  fill="#10b981"
                />

              </BarChart>

            </ResponsiveContainer>
          )}

        </div>

      </div>

    </div>
  );
}