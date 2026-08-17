import {
  FaTrophy,
  FaStar,
  FaBullseye,
  FaRocket,
} from "react-icons/fa";

export default function AchievementCard() {

  const achievements = [
    {
      icon: <FaTrophy className="text-yellow-500 text-4xl" />,
      title: "Resume Master",
      description: "Resume Score Above 90%",
    },
    {
      icon: <FaStar className="text-blue-500 text-4xl" />,
      title: "Interview Expert",
      description: "Completed 5 AI Interviews",
    },
    {
      icon: <FaBullseye className="text-red-500 text-4xl" />,
      title: "Top Performer",
      description: "Top 10% Candidate",
    },
    {
      icon: <FaRocket className="text-green-500 text-4xl" />,
      title: "Active Applicant",
      description: "Applied to 15 Jobs",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {achievements.map((achievement, index) => (

          <div
            key={index}
            className="border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >

            <div className="mb-4">
              {achievement.icon}
            </div>

            <h3 className="text-xl font-semibold">
              {achievement.title}
            </h3>

            <p className="text-gray-500 mt-2">
              {achievement.description}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}