import {
  FaArrowUp,
  FaUsers,
  FaBriefcase,
  FaUserCheck,
} from "react-icons/fa";

export default function AdminReportInsights() {
  const insights = [
    {
      title: "Application Growth",
      description:
        "Applications increased by 25% compared to the previous month.",
      icon: <FaArrowUp />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "User Growth",
      description:
        "Candidate registrations continue to increase across the platform.",
      icon: <FaUsers />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Jobs",
      description:
        "Most recruiter job postings are currently active.",
      icon: <FaBriefcase />,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Hiring Performance",
      description:
        "The platform currently has a 36% overall hiring rate.",
      icon: <FaUserCheck />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Platform Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {insights.map((insight, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 flex items-start gap-4 hover:shadow-sm transition"
          >

            <div
              className={`${insight.bg} ${insight.color} p-3 rounded-full text-lg`}
            >
              {insight.icon}
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                {insight.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {insight.description}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}