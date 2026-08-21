import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const skillData = [
  { name: "Python", value: 40 },
  { name: "Data Science", value: 25 },
  { name: "Machine Learning", value: 20 },
  { name: "SQL", value: 10 },
  { name: "AI", value: 5 },
];
const COLORS = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

export default function TopSkillsChart() {
    return (
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-bold mb-4">
      Top Skills
    </h2>

    <div className="h-80">

    </div>

  </div>
);
}