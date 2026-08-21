import {
  FaRobot,
  FaChartLine,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

export default function AnalyticsInsights() {
    const insights = [
  {
    icon: <FaRobot className="text-blue-600 text-xl" />,
    text: "Python Developer has the highest number of applicants.",
  },
  {
    icon: <FaChartLine className="text-green-600 text-xl" />,
    text: "Average AI Resume Score is 86%.",
  },
  {
    icon: <FaCheckCircle className="text-purple-600 text-xl" />,
    text: "Current hiring success rate is 44%.",
  },
  {
    icon: <FaUserTie className="text-orange-600 text-xl" />,
    text: "Data Scientist roles are filled the fastest.",
  },
];
return (
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-bold mb-6">
      AI Analytics Insights
    </h2>

    <div className="space-y-5">

      {insights.map((item, index) => (

        <div
          key={index}
          className="flex items-start gap-4 border-b pb-4"
        >

          {item.icon}

          <p className="text-gray-700">
            {item.text}
          </p>

        </div>

      ))}

    </div>

  </div>
);
}