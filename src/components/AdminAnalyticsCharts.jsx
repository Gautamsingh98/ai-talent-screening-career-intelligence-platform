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
  Legend,
} from "recharts";

const chartData = {
  "7days": [
    { month: "Mon", candidates: 12, recruiters: 3, applications: 20, hires: 4 },
    { month: "Tue", candidates: 18, recruiters: 4, applications: 28, hires: 5 },
    { month: "Wed", candidates: 15, recruiters: 2, applications: 24, hires: 3 },
    { month: "Thu", candidates: 22, recruiters: 5, applications: 35, hires: 7 },
    { month: "Fri", candidates: 25, recruiters: 6, applications: 40, hires: 8 },
    { month: "Sat", candidates: 20, recruiters: 4, applications: 32, hires: 6 },
    { month: "Sun", candidates: 28, recruiters: 7, applications: 45, hires: 9 },
  ],

  "30days": [
    { month: "Week 1", candidates: 80, recruiters: 15, applications: 120, hires: 18 },
    { month: "Week 2", candidates: 95, recruiters: 20, applications: 150, hires: 22 },
    { month: "Week 3", candidates: 110, recruiters: 24, applications: 180, hires: 28 },
    { month: "Week 4", candidates: 130, recruiters: 28, applications: 210, hires: 32 },
  ],

  "6months": [
    { month: "Jan", candidates: 220, recruiters: 45, applications: 120, hires: 18 },
    { month: "Feb", candidates: 260, recruiters: 52, applications: 150, hires: 22 },
    { month: "Mar", candidates: 300, recruiters: 61, applications: 180, hires: 28 },
    { month: "Apr", candidates: 340, recruiters: 70, applications: 210, hires: 32 },
    { month: "May", candidates: 380, recruiters: 84, applications: 260, hires: 38 },
    { month: "Jun", candidates: 420, recruiters: 100, applications: 320, hires: 45 },
  ],

  year: [
    { month: "Jan", candidates: 180, recruiters: 35, applications: 100, hires: 15 },
    { month: "Feb", candidates: 210, recruiters: 40, applications: 130, hires: 18 },
    { month: "Mar", candidates: 250, recruiters: 48, applications: 160, hires: 23 },
    { month: "Apr", candidates: 290, recruiters: 55, applications: 190, hires: 27 },
    { month: "May", candidates: 330, recruiters: 65, applications: 230, hires: 32 },
    { month: "Jun", candidates: 370, recruiters: 75, applications: 270, hires: 38 },
    { month: "Jul", candidates: 410, recruiters: 88, applications: 310, hires: 44 },
    { month: "Aug", candidates: 450, recruiters: 105, applications: 350, hires: 50 },
  ],
};

export default function AdminAnalyticsCharts({ timeRange }) {
  const data = chartData[timeRange] || chartData["6months"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* User Growth */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          User Growth
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="candidates"
                stroke="#2563EB"
                strokeWidth={3}
                name="Candidates"
              />

              <Line
                type="monotone"
                dataKey="recruiters"
                stroke="#9333EA"
                strokeWidth={3}
                name="Recruiters"
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Recruitment Performance */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Recruitment Performance
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="applications"
                fill="#2563EB"
                name="Applications"
              />

              <Bar
                dataKey="hires"
                fill="#16A34A"
                name="Hires"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}