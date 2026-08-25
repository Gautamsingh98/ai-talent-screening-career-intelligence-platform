import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaUserTie,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

export default function AdminReportSummaryCards() {
  const cards = [
    {
      title: "Total Users",
      value: "520",
      icon: <FaUsers />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Total Jobs",
      value: "86",
      icon: <FaBriefcase />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Applications",
      value: "1,240",
      icon: <FaFileAlt />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Interviews",
      value: "385",
      icon: <FaUserTie />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Hires",
      value: "142",
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Hiring Rate",
      value: "36%",
      icon: <FaChartLine />,
      bg: "bg-pink-100",
      color: "text-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
        >

          <div>
            <p className="text-gray-500 text-sm">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {card.value}
            </h2>
          </div>

          <div
            className={`${card.bg} ${card.color} p-4 rounded-full text-2xl`}
          >
            {card.icon}
          </div>

        </div>
      ))}

    </div>
  );
}