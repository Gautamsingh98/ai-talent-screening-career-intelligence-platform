import {
  FaCheckCircle,
  FaFileUpload,
  FaBriefcase,
  FaRobot,
} from "react-icons/fa";

export default function RecentActivityCard() {
  const activities = [
    {
      icon: <FaFileUpload className="text-blue-600" />,
      title: "Resume Uploaded",
      date: "Today",
    },
    {
      icon: <FaRobot className="text-purple-600" />,
      title: "Resume Analyzed",
      date: "Today",
    },
    {
      icon: <FaBriefcase className="text-green-600" />,
      title: "Applied for Data Scientist",
      date: "Yesterday",
    },
    {
      icon: <FaCheckCircle className="text-orange-600" />,
      title: "Interview Completed",
      date: "2 Days Ago",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex items-center justify-between border-b pb-3"
          >

            <div className="flex items-center gap-4">

              <div className="text-2xl">
                {activity.icon}
              </div>

              <div>

                <h3 className="font-semibold">
                  {activity.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {activity.date}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}