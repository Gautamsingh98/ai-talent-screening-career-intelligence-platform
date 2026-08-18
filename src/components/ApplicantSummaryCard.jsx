import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function ApplicantSummaryCard() {
  const cards = [
    {
      title: "Total Applicants",
      value: 145,
      icon: <FaUsers className="text-4xl text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Pending",
      value: 67,
      icon: <FaClock className="text-4xl text-yellow-600" />,
      bg: "bg-yellow-100",
    },
    {
      title: "Shortlisted",
      value: 38,
      icon: <FaCheckCircle className="text-4xl text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Rejected",
      value: 40,
      icon: <FaTimesCircle className="text-4xl text-red-600" />,
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500">{card.title}</p>
            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>

          <div className={`${card.bg} p-4 rounded-full`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}