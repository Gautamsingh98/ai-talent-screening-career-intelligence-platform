import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaUserPlus,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaUsers,
  FaArrowLeft
} from "react-icons/fa";

export default function AdminRecentActivity() {

  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isActivityPage = location.pathname === "/admin/activity";

  // =====================================================
  // FETCH ADMIN ACTIVITIES
  // =====================================================

  useEffect(() => {

    const fetchActivities = async () => {

      try {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/activity",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await response.json();

        setActivities(data.activities || []);

      } catch (error) {

        console.error("Activity error:", error);

        setError("Unable to load recent activity.");

      } finally {

        setLoading(false);

      }
    };

    fetchActivities();

  }, []);

  // =====================================================
  // FILTER ACTIVITIES
  // =====================================================

  const filteredActivities =
    activeFilter === "all"
      ? activities
      : activities.filter(
          (activity) => activity.type === activeFilter
        );

  // =====================================================
  // ICON
  // =====================================================

  const getIcon = (type) => {

    switch (type) {

      case "user":
        return <FaUserPlus />;

      case "job":
        return <FaBriefcase />;

      case "application":
        return <FaFileAlt />;

      case "hire":
        return <FaCheckCircle />;

      default:
        return <FaUsers />;

    }
  };

  // =====================================================
  // ICON BACKGROUND
  // =====================================================

  const getIconStyle = (type) => {

    switch (type) {

      case "user":
        return "bg-blue-100 text-blue-600";

      case "job":
        return "bg-blue-100 text-blue-600";

      case "application":
        return "bg-yellow-100 text-yellow-600";

      case "hire":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";

    }
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }

    const activityDate = new Date(date);
    const now = new Date();

    const difference =
      Math.floor(
        (now - activityDate) / 1000
      );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {

      const minutes =
        Math.floor(difference / 60);

      return `${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    if (difference < 86400) {

      const hours =
        Math.floor(difference / 3600);

      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    const days =
      Math.floor(difference / 86400);

    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  };

  // =====================================================
  // FILTER BUTTONS
  // =====================================================

  const filters = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "user",
      label: "Users",
    },
    {
      key: "job",
      label: "Jobs",
    },
    {
      key: "application",
      label: "Applications",
    },
    {
      key: "hire",
      label: "Hires",
    },
  ];

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

<div className="flex items-center justify-between mb-6">

  <div>

    {/* BACK ARROW + BACK */}
    {isActivityPage && (
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm transition duration-200 mb-2"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>
    )}

    <h2 className="text-xl font-bold text-gray-800">
      {isActivityPage
        ? "Platform Activity"
        : "Recent Platform Activity"}
    </h2>

    <p className="text-gray-500 text-sm mt-1">
      {isActivityPage
        ? "View all recent activity across the platform"
        : "Latest activity across the platform"}
    </p>

  </div>

  {/* VIEW ALL - ONLY ON DASHBOARD */}
  {!isActivityPage && (
    <button
      onClick={() => navigate("/admin/activity")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition duration-200"
    >
      View All
    </button>
  )}

</div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="flex flex-wrap gap-3 mb-5">

        {filters.map((filter) => (

          <button
            key={filter.key}
            onClick={() =>
              setActiveFilter(filter.key)
            }
            className={`
              px-5 py-2 rounded-lg text-sm font-medium
              transition
              ${
                activeFilter === filter.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {filter.label}
          </button>

        ))}

      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && (

        <div className="py-10 text-center text-gray-500">

          Loading recent activity...

        </div>

      )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {!loading && error && (

        <div className="py-10 text-center text-red-500">

          {error}

        </div>

      )}

      {/* ================================================= */}
      {/* NO DATA */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        filteredActivities.length === 0 && (

          <div className="py-10 text-center text-gray-500">

            No recent activity found.

          </div>

        )}

      {/* ================================================= */}
      {/* ACTIVITY LIST */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        filteredActivities.length > 0 && (

          <div>

            {filteredActivities.map(
              (activity, index) => (

                <div
                  key={`${activity.type}-${index}`}
                  className="
                    flex items-center
                    gap-4
                    py-5
                    border-b
                    border-gray-100
                    last:border-b-0
                  "
                >

                  {/* ICON */}

                  <div
                    className={`
                      w-12 h-12
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-lg
                      flex-shrink-0
                      ${getIconStyle(activity.type)}
                    `}
                  >
                    {getIcon(activity.type)}
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <h3 className="font-semibold text-gray-800">

                      {activity.title}

                    </h3>

                    <p className="text-gray-500 text-sm mt-1">

                      {activity.description}

                    </p>

                  </div>

                  {/* TIME */}

                  <div className="text-sm text-gray-400 whitespace-nowrap">

                    {formatTime(activity.created_at)}

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </div>

  );
}