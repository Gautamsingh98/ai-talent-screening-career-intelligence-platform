import { FaRobot, FaCheckCircle } from "react-icons/fa";

export default function RecruiterAIInsights() {

  const insights = [
    "Python Developers received the highest number of applications.",
    "Average resume score increased by 12% this month.",
    "AI Engineer positions take longer to fill.",
    "Consider posting more Data Analyst jobs.",
  ];

  return (

    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex items-center gap-3 mb-6">

        <FaRobot className="text-3xl text-blue-600" />

        <h2 className="text-2xl font-bold">
          AI Hiring Insights
        </h2>

      </div>

      <div className="space-y-4">

        {insights.map((insight, index) => (

          <div
            key={index}
            className="flex items-start gap-3"
          >

            <FaCheckCircle className="text-green-600 mt-1" />

            <p className="text-gray-700">
              {insight}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}