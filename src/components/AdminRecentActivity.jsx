import {
  FaUserPlus,
  FaBriefcase,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";

export default function AdminRecentActivity() {
  const activities = [
    {
      title: "New candidate registered",
      description: "Aarav Sharma joined the platform",
      time: "10 minutes ago",
      icon: <FaUserPlus />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "New recruiter registered",
      description: "Tech Solutions created an account",
      time: "30 minutes ago",
      icon: <FaUserPlus />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "New job posted",
      description: "Data Scientist position added",
      time: "1 hour ago",
      icon: <FaBriefcase />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Candidate shortlisted",
      description: "Priya Singh was shortlisted",
      time: "2 hours ago",
      icon: <FaCheckCircle />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "New resume uploaded",
      description: "Rohan Gupta uploaded a resume",
      time: "3 hours ago",
      icon: <FaFileAlt />,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recent Activity
        </h2>

        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          View All
        </button>

      </div>

      {/* Activities */}
      <div className="space-y-5">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4"
          >

            {/* Icon */}
            <div
              className={`${activity.bg} ${activity.color} w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0`}
            >
              {activity.icon}
            </div>

            {/* Information */}
            <div className="flex-1">

              <h3 className="font-semibold text-gray-800">
                {activity.title}
              </h3>

              <p className="text-sm text-gray-500">
                {activity.description}
              </p>

            </div>

            {/* Time */}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {activity.time}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}