import {
  FaBriefcase,
  FaUsers,
  FaUserCheck,
  FaChartLine,
} from "react-icons/fa";

export default function RecruiterReportSummaryCard({ stats, loading }) {
  const applicants = stats?.applicants || 0;
  const hired = stats?.hired || 0;

  // Calculate hiring success rate
  const successRate =
    applicants > 0
      ? Math.round((hired / applicants) * 100)
      : 0;

  const reports = [
    {
      title: "Jobs Posted",
      value: stats?.jobs_posted || 0,
      icon: <FaBriefcase className="text-4xl text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Applications",
      value: applicants,
      icon: <FaUsers className="text-4xl text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Hired",
      value: hired,
      icon: <FaUserCheck className="text-4xl text-purple-600" />,
      bg: "bg-purple-100",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: <FaChartLine className="text-4xl text-orange-600" />,
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      {reports.map((report, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center"
        >

          <div>
            <p className="text-gray-500">
              {report.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : report.value}
            </h2>
          </div>

          <div className={`${report.bg} p-4 rounded-full`}>
            {report.icon}
          </div>

        </div>
      ))}

    </div>
  );
}