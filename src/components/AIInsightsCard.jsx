import { FaRobot, FaCheckCircle } from "react-icons/fa";

export default function AIInsightsCard({ insights = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaRobot className="text-3xl text-blue-600" />

        <h2 className="text-2xl font-bold">
          AI Career Insights
        </h2>
      </div>

      <div className="space-y-4">
        {insights.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <FaCheckCircle className="text-green-600 mt-1" />

            <p className="text-gray-700">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}