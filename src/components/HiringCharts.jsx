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

const applicationData = [
  { month: "Jan", applications: 25 },
  { month: "Feb", applications: 40 },
  { month: "Mar", applications: 55 },
  { month: "Apr", applications: 70 },
  { month: "May", applications: 90 },
  { month: "Jun", applications: 120 },
];

const hiringData = [
  { role: "Python", hired: 8 },
  { role: "Data Sci", hired: 5 },
  { role: "AI Eng", hired: 3 },
  { role: "Web Dev", hired: 6 },
];

export default function HiringCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Applications Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-6">
          Applications Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={applicationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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

      {/* Hiring Success */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-6">
          Hiring Success
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hiringData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" />
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
  );
}