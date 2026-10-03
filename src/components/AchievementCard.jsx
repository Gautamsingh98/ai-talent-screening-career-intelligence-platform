import {
  FaTrophy,
  FaStar,
  FaBullseye,
  FaRocket,
} from "react-icons/fa";

export default function AchievementCard({
  achievements = [],
}) {

  const getAchievementIcon = (icon) => {

    switch (icon) {

      case "trophy":
        return (
          <FaTrophy className="text-yellow-500 text-4xl" />
        );

      case "star":
        return (
          <FaStar className="text-blue-500 text-4xl" />
        );

      case "target":
        return (
          <FaBullseye className="text-red-500 text-4xl" />
        );

      case "rocket":
        return (
          <FaRocket className="text-green-500 text-4xl" />
        );

      default:
        return (
          <FaTrophy className="text-yellow-500 text-4xl" />
        );
    }
  };

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
              {getAchievementIcon(
                achievement.icon
              )}
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