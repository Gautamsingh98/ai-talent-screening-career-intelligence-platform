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

export default function HiringCharts() {

  const [applicationData, setApplicationData] = useState([]);
  const [hiringData, setHiringData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    const fetchChartData = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/recruiter/dashboard/charts"
        );

        setApplicationData(
          response.data.application_data || []
        );

        setHiringData(
          response.data.hiring_data || []
        );

      } catch (error) {

        console.error(
          "Dashboard chart data error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load chart data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchChartData();

  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* =====================================================
          APPLICATIONS TREND
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-6">
          Applications Trend
        </h2>

        {loading ? (

          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Loading chart...
          </div>

        ) : error ? (

          <div className="h-[300px] flex items-center justify-center text-red-500">
            {error}
          </div>

        ) : applicationData.length === 0 ? (

          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No application data available.
          </div>

        ) : (

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={applicationData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="applications"
                stroke="#2563eb"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>


      {/* =====================================================
          HIRING SUCCESS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-6">
          Hiring Success
        </h2>

        {loading ? (

          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Loading chart...
          </div>

        ) : error ? (

          <div className="h-[300px] flex items-center justify-center text-red-500">
            {error}
          </div>

        ) : hiringData.length === 0 ? (

          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No hired candidates yet.
          </div>

        ) : (

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={hiringData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="role"
                tick={{ fontSize: 12 }}
              />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="hired"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}