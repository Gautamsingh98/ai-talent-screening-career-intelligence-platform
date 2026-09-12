import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import API from "../api/axios";

export default function RecruiterReportCharts() {
  const [hiringTrend, setHiringTrend] = useState([]);
  const [applicationsByRole, setApplicationsByRole] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReportCharts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/api/recruiter/reports/charts");

        setHiringTrend(response.data.hiring_trend || []);
        setApplicationsByRole(
          response.data.applications_by_role || []
        );

      } catch (err) {
        console.error("Recruiter report chart error:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load report charts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportCharts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
          <p className="text-gray-500">
            Loading hiring trend...
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
          <p className="text-gray-500">
            Loading application statistics...
          </p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Hiring Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Hiring Trend
        </h2>

        {hiringTrend.length === 0 ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-500">
              No hiring data available yet.
            </p>
          </div>
        ) : (
          <div className="h-72">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={hiringTrend}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="hired"
                  stroke="#2563EB"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* Applications By Role */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Applications by Job Role
        </h2>

        {applicationsByRole.length === 0 ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-500">
              No application data available yet.
            </p>
          </div>
        ) : (
          <div className="h-72">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={applicationsByRole}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="role" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="applications"
                  fill="#16A34A"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

    </div>
  );
}