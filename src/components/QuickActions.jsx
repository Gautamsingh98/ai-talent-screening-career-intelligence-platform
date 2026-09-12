import {
  FaPlusCircle,
  FaUsers,
  FaRobot,
  FaDownload,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Post New Job",
      description: "Create a new job posting",
      icon: <FaPlusCircle className="text-4xl text-blue-600" />,
      action: () => navigate("/recruiter/jobs"),
    },
    {
      title: "View Applicants",
      description: "Manage candidate applications",
      icon: <FaUsers className="text-4xl text-green-600" />,
      action: () => navigate("/recruiter/applicants"),
    },
    {
      title: "AI Candidate Ranking",
      description: "View candidate rankings",
      icon: <FaRobot className="text-4xl text-purple-600" />,
      action: () => navigate("/recruiter/jobs"),
    },
    {
      title: "Download Report",
      description: "View hiring reports",
      icon: <FaDownload className="text-4xl text-orange-600" />,
      action: () => navigate("/recruiter/reports"),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {actions.map((action, index) => (
          <div
            key={index}
            onClick={action.action}
            className="border rounded-xl p-6 text-center
            hover:shadow-lg hover:-translate-y-1
            transition duration-300 cursor-pointer"
          >

            <div className="flex justify-center mb-4">
              {action.icon}
            </div>

            <h3 className="font-bold text-lg">
              {action.title}
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              {action.description}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}