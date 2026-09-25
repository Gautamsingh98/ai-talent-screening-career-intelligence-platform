import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminCharts() {

  const [userGrowth, setUserGrowth] = useState([]);

  const [monthlyApplications, setMonthlyApplications] = useState([]);

  const [applicationStatus, setApplicationStatus] = useState([]);

  const [jobsByRecruiter, setJobsByRecruiter] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN CHART DATA
  // =====================================================

  useEffect(() => {

    const fetchChartData = async () => {

      try {

        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/charts",
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
            "Failed to fetch admin chart data"
          );

        }

        const data = await response.json();

        setUserGrowth(
          data.user_growth || []
        );

        setMonthlyApplications(
          data.monthly_applications || []
        );

        setApplicationStatus(
          data.application_status || []
        );

        setJobsByRecruiter(
          data.jobs_by_recruiter || []
        );

      } catch (err) {

        console.error(
          "Admin chart error:",
          err
        );

        setError(
          "Unable to load analytics data."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchChartData();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">

        <p className="text-gray-500">
          Loading admin analytics...
        </p>

      </div>

    );

  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">

        <p className="text-red-500">
          {error}
        </p>

      </div>

    );

  }

  // =====================================================
  // PIE COLORS
  // =====================================================

  const pieColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  return (

    <div className="mt-8 space-y-8">

      {/* =================================================
          ROW 1
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* USER GROWTH */}

        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Monthly User Growth
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              New users registered during the last 6 months
            </p>

          </div>

          <div className="h-[320px]">

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
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* MONTHLY APPLICATIONS */}

        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Monthly Applications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Application activity across the platform
            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={monthlyApplications}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="applications"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* =================================================
          ROW 2
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* APPLICATION STATUS */}

        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Application Status
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Distribution of candidate applications
            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={applicationStatus}
                  dataKey="total"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={3}
                  label
                >

                  {applicationStatus.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          pieColors[
                            index %
                            pieColors.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* JOBS BY RECRUITER */}

        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Jobs by Recruiter
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Job posting activity by recruiter
            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={jobsByRecruiter}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 30,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                />

                <YAxis
                  type="category"
                  dataKey="recruiter"
                  width={100}
                />

                <Tooltip />

                <Bar
                  dataKey="jobs"
                  fill="#8B5CF6"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>

  );
}