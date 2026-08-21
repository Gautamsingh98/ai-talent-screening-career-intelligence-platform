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

const monthlyApplications = [
  { month: "Jan", applications: 45 },
  { month: "Feb", applications: 52 },
  { month: "Mar", applications: 61 },
  { month: "Apr", applications: 55 },
  { month: "May", applications: 70 },
  { month: "Jun", applications: 82 },
];

const hiringSuccess = [
  { month: "Jan", hired: 12 },
  { month: "Feb", hired: 18 },
  { month: "Mar", hired: 22 },
  { month: "Apr", hired: 20 },
  { month: "May", hired: 28 },
  { month: "Jun", hired: 35 },
];

export default function AnalyticsCharts() {
    return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl shadow-md p-6">

         <h2 className="text-xl font-bold mb-4">
             Monthly Applications
         </h2>

        <div className="h-72">
       <ResponsiveContainer width="100%" height="100%">
  <LineChart data={monthlyApplications}>
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
<div className="bg-white rounded-xl shadow-md p-6">

  <h2 className="text-xl font-bold mb-4">
    Hiring Success Rate
  </h2>

  <div className="h-72">
   <ResponsiveContainer width="100%" height="100%">
  <BarChart data={hiringSuccess}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar
      dataKey="hired"
      fill="#16A34A"
    />
  </BarChart>
</ResponsiveContainer>
  </div>

</div>
  </div>
);
}