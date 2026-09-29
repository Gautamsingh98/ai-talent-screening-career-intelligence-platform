import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminReportInsights() {

  const insights = [

    {
      title: "User Growth",
      description:
        "Monitor candidate and recruiter growth across the platform.",
      icon: <FaUsers />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    {
      title: "Job Activity",
      description:
        "Track the number of jobs posted by recruiters.",
      icon: <FaBriefcase />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },

    {
      title: "Application Activity",
      description:
        "Analyze how candidates are applying to available jobs.",
      icon: <FaFileAlt />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },

    {
      title: "Hiring Performance",
      description:
        "Measure hiring results and overall recruitment performance.",
      icon: <FaCheckCircle />,
      bg: "bg-green-100",
      color: "text-green-600",
    },

  ];


  return (

    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Platform Insights
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Key insights into platform activity and recruitment performance.
        </p>

      </div>


      {/* INSIGHTS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {insights.map((item, index) => (

          <div
            key={index}
            className="
              flex
              items-start
              gap-4
              p-5
              rounded-xl
              border
              border-gray-100
              hover:shadow-sm
              transition
            "
          >

            {/* ICON */}

            <div
              className={`
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                text-lg
                flex-shrink-0
                ${item.bg}
                ${item.color}
              `}
            >

              {item.icon}

            </div>


            {/* CONTENT */}

            <div>

              <h3 className="font-semibold text-gray-800">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {item.description}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}