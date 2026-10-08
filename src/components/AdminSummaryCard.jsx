import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
  FaFileAlt,
  FaUserCheck,
} from "react-icons/fa";

export default function AdminSummaryCard({

  totalUsers = 0,

  totalCandidates = 0,

  totalRecruiters = 0,

  totalJobs = 0,

  totalApplications = 0,

  totalHired = 0,

}) {

  const cards = [

    {
      title: "Total Users",
      value: totalUsers,
      icon: FaUsers,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Candidates",
      value: totalCandidates,
      icon: FaUserGraduate,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Recruiters",
      value: totalRecruiters,
      icon: FaUserTie,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Jobs Posted",
      value: totalJobs,
      icon: FaBriefcase,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Applications",
      value: totalApplications,
      icon: FaFileAlt,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },

    {
      title: "Hired",
      value: totalHired,
      icon: FaUserCheck,
      bg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500 font-medium">
                  {card.title}
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h2>

              </div>

              <div
                className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center`}
              >

                <Icon
                  className={`text-xl ${card.iconColor}`}
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );
}