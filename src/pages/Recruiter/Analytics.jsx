import { useEffect, useState } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaFileAlt,
  FaUserTie,
  FaClipboardCheck,
  FaChartLine,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


export default function Analytics() {

  // =====================================================
  // STATES
  // =====================================================

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  useEffect(() => {

    fetchAnalytics();

  }, []);


  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {

        setError("Authentication token not found.");

        return;
      }


      const response = await fetch(
        "http://localhost:5000/api/recruiter/analytics",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message || "Failed to fetch analytics"
        );
      }


      setAnalytics(data);

    } catch (error) {

      console.error(
        "Analytics error:",
        error
      );

      setError(
        error.message ||
        "Failed to load recruiter analytics."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <RecruiterLayout>

        <div className="p-8 text-center">

          <p className="text-gray-500">
            Loading recruitment analytics...
          </p>

        </div>

      </RecruiterLayout>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <RecruiterLayout>

        <div className="p-8">

          <div className="bg-red-100 text-red-700 p-4 rounded-lg">

            {error}

          </div>

        </div>

      </RecruiterLayout>
    );
  }


  // =====================================================
  // DATA
  // =====================================================

  const overview = analytics?.overview || {};

  const monthlyData =
    analytics?.monthly_data || [];

  const applicationsByJob =
    analytics?.applications_by_job || [];

  // =====================================================
  // UI
  // =====================================================

  return (

    <RecruiterLayout>

      <div className="p-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold">

              Recruitment Analytics

            </h1>

            <p className="text-gray-500 mt-2">

              Analyze recruitment performance
              and hiring trends.

            </p>

          </div>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


          {/* APPLICATIONS */}

          <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Applications
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {overview.total_applications || 0}

              </h2>

            </div>

            <div className="bg-blue-100 p-5 rounded-full">

              <FaFileAlt
                className="text-blue-600 text-2xl"
              />

            </div>

          </div>


          {/* INTERVIEWS */}

          <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Interviews
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {overview.total_interviews || 0}

              </h2>

            </div>

            <div className="bg-green-100 p-5 rounded-full">

              <FaUserTie
                className="text-green-600 text-2xl"
              />

            </div>

          </div>


          {/* HIRED */}

          <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Offers
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {overview.total_hired || 0}

              </h2>

            </div>

            <div className="bg-yellow-100 p-5 rounded-full">

              <FaClipboardCheck
                className="text-yellow-600 text-2xl"
              />

            </div>

          </div>


          {/* HIRING RATE */}

          <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Hiring Rate
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {overview.hiring_rate || 0}%

              </h2>

            </div>

            <div className="bg-pink-100 p-5 rounded-full">

              <FaChartLine
                className="text-pink-600 text-2xl"
              />

            </div>

          </div>

        </div>


        {/* =================================================
            CHARTS
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


          {/* MONTHLY APPLICATIONS */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-6">

              Monthly Applications

            </h2>


            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={monthlyData}
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
                    dataKey="applications"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* HIRING SUCCESS */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-6">

              Hiring Success Rate

            </h2>


            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={monthlyData}
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
                    dataKey="hired"
                    fill="#16a34a"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* =================================================
            APPLICATIONS BY JOB
        ================================================= */}

        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold mb-6">

            Applications by Job

          </h2>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Job
                  </th>

                  <th className="text-left py-3">
                    Applications
                  </th>

                </tr>

              </thead>


              <tbody>

                {applicationsByJob.length > 0 ? (

                  applicationsByJob.map((job) => (

                    <tr
                      key={job.job_id}
                      className="border-b"
                    >

                      <td className="py-3">

                        {job.job_title}

                      </td>

                      <td className="py-3">

                        {job.applications}

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="2"
                      className="text-center py-6 text-gray-500"
                    >

                      No application data available.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            MONTHLY PERFORMANCE
        ================================================= */}

        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold mb-6">

            Monthly Recruitment Performance

          </h2>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Month
                  </th>

                  <th className="text-left py-3">
                    Applications
                  </th>

                  <th className="text-left py-3">
                    Interviews
                  </th>

                  <th className="text-left py-3">
                    Hired
                  </th>

                  <th className="text-left py-3">
                    Success Rate
                  </th>

                </tr>

              </thead>


              <tbody>

                {monthlyData.length > 0 ? (

                  monthlyData.map((row) => (

                    <tr
                      key={`${row.year}-${row.month_number}`}
                      className="border-b"
                    >

                      <td className="py-3">
                        {row.month}
                      </td>

                      <td className="py-3">
                        {row.applications}
                      </td>

                      <td className="py-3">
                        {row.interviews}
                      </td>

                      <td className="py-3 text-green-600 font-semibold">
                        {row.hired}
                      </td>

                      <td className="py-3 text-blue-600 font-semibold">
                        {row.success_rate}%
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500"
                    >

                      No monthly recruitment data available.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>

    </RecruiterLayout>
  );
}