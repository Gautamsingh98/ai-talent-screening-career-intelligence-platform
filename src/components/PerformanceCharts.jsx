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

const resumeData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 84 },
  { month: "May", score: 90 },
  { month: "Jun", score: 92 },
];

const interviewData = [
  { interview: "I1", score: 70 },
  { interview: "I2", score: 75 },
  { interview: "I3", score: 82 },
  { interview: "I4", score: 88 },
];

export default function PerformanceCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Resume Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Resume Score Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={resumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
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

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={interviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="interview" />
            <YAxis />
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