import { useState } from "react";
import {
  FaUserPlus,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminRecentActivity() {
  const [filter, setFilter] = useState("all");

  const activities = [
    {
      type: "user",
      title: "New Candidate Registered",
      description: "Aarav Sharma created a candidate account.",
      time: "10 minutes ago",
      icon: <FaUserPlus />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      type: "job",
      title: "New Job Posted",
      description: "Tech Solutions posted a Data Scientist position.",
      time: "25 minutes ago",
      icon: <FaBriefcase />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      type: "application",
      title: "New Application",
      description: "A candidate applied for Python Developer.",
      time: "45 minutes ago",
      icon: <FaFileAlt />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      type: "hire",
      title: "Candidate Hired",
      description: "Rohan Gupta was hired for AI Engineer.",
      time: "1 hour ago",
      icon: <FaCheckCircle />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      type: "user",
      title: "New Recruiter Registered",
      description: "AI Innovations joined the platform.",
      time: "2 hours ago",
      icon: <FaUserPlus />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((activity) => activity.type === filter);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Platform Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest activity across the platform
          </p>
        </div>

        <button
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          onClick={() => alert("All activity will be available here.")}
        >
          View All
        </button>

      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("user")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setFilter("job")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === "job"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Jobs
        </button>

        <button
          onClick={() => setFilter("application")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === "application"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Applications
        </button>

        <button
          onClick={() => setFilter("hire")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === "hire"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Hires
        </button>

      </div>

      {/* Activities */}
      <div className="space-y-5">

        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (

            <div
              key={index}
              className="flex items-start gap-4 border-b last:border-b-0 pb-5 last:pb-0"
            >

              {/* Icon */}
              <div
                className={`${activity.bg} ${activity.color} w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0`}
              >
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">

                  <h3 className="font-semibold text-gray-800">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-gray-400">
                    {activity.time}
                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {activity.description}
                </p>

              </div>

            </div>

          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No activity found.
          </div>
        )}

      </div>

    </div>
  );
}