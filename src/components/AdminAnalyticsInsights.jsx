import {
  FaArrowUp,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminAnalyticsInsights() {
  const insights = [
    {
      title: "User Growth",
      value: "+18%",
      description: "Total platform users increased this month.",
      icon: <FaArrowUp />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Candidate Growth",
      value: "+22%",
      description: "Candidate registrations are increasing steadily.",
      icon: <FaUsers />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Job Activity",
      value: "64",
      description: "Jobs are currently active on the platform.",
      icon: <FaBriefcase />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Applications",
      value: "+25%",
      description: "Applications increased compared to last month.",
      icon: <FaFileAlt />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Hiring Performance",
      value: "36%",
      description: "Current overall platform hiring rate.",
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Analytics Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {insights.map((insight, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition"
          >

            <div className="flex items-center justify-between mb-4">

              <div
                className={`${insight.bg} ${insight.color} p-3 rounded-full text-lg`}
              >
                {insight.icon}
              </div>

              <span
                className={`${insight.color} font-bold text-lg`}
              >
                {insight.value}
              </span>

            </div>

            <h3 className="font-semibold text-gray-800">
              {insight.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {insight.description}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}