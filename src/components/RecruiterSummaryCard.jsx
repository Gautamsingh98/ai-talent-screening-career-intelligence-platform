import {
  FaBriefcase,
  FaUsers,
  FaUserCheck,
  FaCheckCircle,
} from "react-icons/fa";

export default function RecruiterSummaryCard() {
  const stats = [
    {
      title: "Jobs Posted",
      value: "12",
      progress: "80%",
      footer: "+2 This Month",
      icon: <FaBriefcase className="text-3xl text-blue-600" />,
      color: "bg-blue-500",
    },
    {
      title: "Applications",
      value: "145",
      progress: "90%",
      footer: "+35 New Applications",
      icon: <FaUsers className="text-3xl text-purple-600" />,
      color: "bg-purple-500",
    },
    {
      title: "Shortlisted",
      value: "38",
      progress: "70%",
      footer: "26% Selection Rate",
      icon: <FaUserCheck className="text-3xl text-orange-500" />,
      color: "bg-orange-500",
    },
    {
      title: "Hired",
      value: "8",
      progress: "60%",
      footer: "+3 This Month",
      icon: <FaCheckCircle className="text-3xl text-green-600" />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
        >
          {/* Top Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>
            </div>

            {item.icon}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full`}
                style={{ width: item.progress }}
              ></div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {item.progress} Completed
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 border-t pt-3">
            <p className="text-sm font-medium text-gray-700">
              {item.footer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}