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
const hiringTrend = [
  { month: "Jan", hired: 2 },
  { month: "Feb", hired: 4 },
  { month: "Mar", hired: 6 },
  { month: "Apr", hired: 5 },
  { month: "May", hired: 8 },
  { month: "Jun", hired: 10 },
];

const applicationsByRole = [
  { role: "Python", applications: 35 },
  { role: "Data Science", applications: 48 },
  { role: "AI", applications: 28 },
  { role: "ML", applications: 20 },
];

export default function RecruiterReportCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hiring Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Hiring Trend
        </h2>

        <div className="h-72">

  <ResponsiveContainer width="100%" height="100%">

    <LineChart data={hiringTrend}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />

      <YAxis />

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

      </div>

      {/* Applications by Role */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Applications by Job Role
        </h2>

        <div className="h-72">

  <ResponsiveContainer width="100%" height="100%">

    <BarChart data={applicationsByRole}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="role" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="applications"
        fill="#16A34A"
      />

    </BarChart>

  </ResponsiveContainer>

</div>

      </div>

    </div>
  );
}