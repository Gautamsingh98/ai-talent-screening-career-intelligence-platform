import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const usersByRole = [
  {
    role: "Candidates",
    users: 420,
  },
  {
    role: "Recruiters",
    users: 100,
  },
];

const monthlyRegistrations = [
  {
    month: "Jan",
    users: 35,
  },
  {
    month: "Feb",
    users: 42,
  },
  {
    month: "Mar",
    users: 55,
  },
  {
    month: "Apr",
    users: 48,
  },
  {
    month: "May",
    users: 67,
  },
  {
    month: "Jun",
    users: 82,
  },
];

export default function AdminDashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

      {/* Users by Role */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Users by Role
        </h2>

        <div className="h-72">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={usersByRole}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="role" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="users"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Monthly Registrations */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Monthly Registrations
        </h2>

        <div className="h-72">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={monthlyRegistrations}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="users"
                fill="#16A34A"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}