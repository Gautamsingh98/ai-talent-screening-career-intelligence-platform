import {
  FaUsers,
  FaUserGraduate,
  FaUserTie,
  FaUserCheck,
} from "react-icons/fa";

export default function AdminSummaryCards() {
  const cards = [
    {
      title: "Total Users",
      value: "520",
      icon: <FaUsers />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Candidates",
      value: "420",
      icon: <FaUserGraduate />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Recruiters",
      value: "100",
      icon: <FaUserTie />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Active Users",
      value: "495",
      icon: <FaUserCheck />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
        >

          {/* Text */}
          <div>

            <p className="text-gray-500 text-sm">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {card.value}
            </h2>

          </div>

          {/* Icon */}
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