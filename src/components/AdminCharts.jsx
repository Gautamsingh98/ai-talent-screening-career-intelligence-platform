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

const userGrowth = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 250 },
  { month: "Apr", users: 340 },
  { month: "May", users: 450 },
  { month: "Jun", users: 580 },
];

const jobsApplications = [
  { month: "Jan", jobs: 20, applications: 120 },
  { month: "Feb", jobs: 28, applications: 180 },
  { month: "Mar", jobs: 35, applications: 250 },
  { month: "Apr", jobs: 42, applications: 320 },
  { month: "May", jobs: 50, applications: 410 },
  { month: "Jun", jobs: 65, applications: 520 },
];

export default function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

      {/* User Growth */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          User Growth
        </h2>

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={userGrowth}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#2563EB"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Jobs & Applications */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Jobs & Applications
        </h2>

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={jobsApplications}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="jobs"
                fill="#7C3AED"
                name="Jobs"
              />

              <Bar
                dataKey="applications"
                fill="#16A34A"
                name="Applications"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}