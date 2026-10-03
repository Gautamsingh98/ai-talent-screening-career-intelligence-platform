import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceCharts({ data }) {

  const resumeData = data?.resume_trend || [];

  const interviewData =
    data?.interview_performance || [];

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Resume Trend */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Resume Score Trend
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart data={resumeData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="period"
            />

            <YAxis
              domain={[0, 100]}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* Interview Performance */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Interview Performance
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={interviewData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="period"
            />

            <YAxis
              domain={[0, 100]}
            />

            <Tooltip />

            <Bar
              dataKey="score"
              fill="#16a34a"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}