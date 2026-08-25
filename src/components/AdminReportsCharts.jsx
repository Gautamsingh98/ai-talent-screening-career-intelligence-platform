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

const monthlyData = [
  {
    month: "Jan",
    applications: 120,
    hires: 18,
  },
  {
    month: "Feb",
    applications: 150,
    hires: 22,
  },
  {
    month: "Mar",
    applications: 180,
    hires: 28,
  },
  {
    month: "Apr",
    applications: 210,
    hires: 32,
  },
  {
    month: "May",
    applications: 260,
    hires: 38,
  },
  {
    month: "Jun",
    applications: 320,
    hires: 45,
  },
];

export default function AdminReportsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* Applications Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Monthly Applications
        </h2>

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="applications"
                stroke="#2563EB"
                strokeWidth={3}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Hiring Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Monthly Hires
        </h2>

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="hires"
                fill="#16A34A"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}