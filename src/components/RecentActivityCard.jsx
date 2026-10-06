import {
  FaCheckCircle,
  FaFileUpload,
  FaBriefcase,
  FaRobot,
} from "react-icons/fa";

export default function RecentActivityCard({
  activities = [],
}) {

  const getActivityIcon = (icon) => {

    switch (icon) {

      case "resume":
        return (
          <FaFileUpload className="text-blue-600" />
        );

      case "analysis":
        return (
          <FaRobot className="text-purple-600" />
        );

      case "application":
        return (
          <FaBriefcase className="text-blue-600" />
        );

      case "check":
        return (
          <FaCheckCircle className="text-green-600" />
        );

      default:
        return (
          <FaCheckCircle className="text-gray-600" />
        );
    }
  };


  const formatActivityTime = (time) => {

    if (!time) {
      return "";
    }

    const activityDate = new Date(time);
    const now = new Date();

    const difference =
      now.getTime() - activityDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 60) {

      if (minutes <= 1) {
        return "Just now";
      }

      return `${minutes} Minutes Ago`;
    }

    if (hours < 24) {

      if (hours === 1) {
        return "1 Hour Ago";
      }

      return `${hours} Hours Ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} Days Ago`;
    }

    return activityDate.toLocaleDateString();
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.length > 0 ? (

          activities.map((activity, index) => (

            <div
              key={`${activity.title}-${index}`}
              className="flex items-center justify-between border-b pb-3"
            >

              <div className="flex items-center gap-4">

                <div className="text-2xl">
                  {getActivityIcon(activity.icon)}
                </div>

                <div>

                  <h3 className="font-semibold">
                    {activity.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {formatActivityTime(activity.time)}
                  </p>

                </div>

              </div>

            </div>

          ))

        ) : (

          <p className="text-gray-500">
            No recent activity.
          </p>

        )}

      </div>

    </div>
  );
}