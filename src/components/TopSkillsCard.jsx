import {
  FaPython,
  FaDatabase,
  FaChartBar,
} from "react-icons/fa";

export default function TopSkillsCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Top Skills
      </h2>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <FaPython className="text-yellow-500 text-xl" />
          <span>Python</span>
        </div>

        <div className="flex items-center gap-3">
          <FaDatabase className="text-blue-600 text-xl" />
          <span>SQL</span>
        </div>

        <div className="flex items-center gap-3">
          <FaChartBar className="text-green-600 text-xl" />
          <span>Data Analysis</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-purple-600 font-bold">ML</span>
          <span>Machine Learning</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-orange-600 font-bold">P</span>
          <span>Pandas</span>
        </div>

      </div>

    </div>
  );
}