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

export default function AdminAnalyticsCharts() {

  const [userGrowth, setUserGrowth] = useState([]);
  const [recruiterPerformance, setRecruiterPerformance] = useState([]);

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

          throw new Error(
            `Failed to fetch analytics (${response.status})`
          );

        }

        const data = await response.json();

        console.log(
          "ADMIN ANALYTICS CHART DATA:",
          data
        );

        setUserGrowth(data.user_growth || []);

        setRecruiterPerformance(
          data.recruiter_performance || []
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

    fetchAnalytics();

  }, []);


  if (loading) {

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-md p-6">
          Loading user growth...
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          Loading recruitment performance...
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
            Monthly growth of users across the platform.
          </p>

        </div>


        <div className="w-full h-[320px]">

          {userGrowth.length === 0 ? (

            <div className="h-full flex items-center justify-center text-gray-400">
              No user growth data available.
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={userGrowth}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis allowDecimals={false} />

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
            Applications, interviews, and hires over time.
          </p>

        </div>


        <div className="w-full h-[320px]">

          {recruiterPerformance.length === 0 ? (

            <div className="h-full flex items-center justify-center text-gray-400">
              No recruitment data available.
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={recruiterPerformance}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis allowDecimals={false} />

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