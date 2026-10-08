import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";

export default function RecruiterNavbar() {
  const [profile, setProfile] = useState(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Notification states
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

// =========================================================
// SEARCH RECRUITER JOBS
// =========================================================

const handleSearch = async (value) => {
  setSearch(value);

  if (!value.trim()) {
    setSearchResults([]);
    setShowSearchResults(false);
    return;
  }

  try {
    const response = await API.get(
      `/api/recruiter/jobs?search=${encodeURIComponent(value)}`
    );

    if (response.data.success) {
      setSearchResults(response.data.jobs);
      setShowSearchResults(true);
    }
  } catch (error) {
    console.error("Recruiter job search failed:", error);
  }
};

  // =========================================================
  // FETCH LOGGED-IN RECRUITER PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/auth/profile");

        console.log("PROFILE RESPONSE:", response.data);

        setProfile(response.data.user);
      } catch (error) {
        console.error("PROFILE ERROR:", error);
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
      }
    };

    fetchProfile();
  }, []);

  // =========================================================
  // FETCH UNREAD NOTIFICATION COUNT
  // =========================================================

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await API.get(
          "/api/recruiter/notifications/unread-count"
        );

        console.log("UNREAD COUNT:", response.data);

        if (response.data.success) {
          setUnreadCount(response.data.unread_count);
        }
      } catch (error) {
        console.error(
          "Failed to fetch recruiter notification count:",
          error
        );
      }
    };

    fetchUnreadCount();
  }, []);

  // =========================================================
  // FETCH ALL NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async () => {
    try {
      const response = await API.get(
        "/api/recruiter/notifications/"
      );

      console.log("RECRUITER NOTIFICATIONS:", response.data);

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error(
        "Failed to fetch recruiter notifications:",
        error
      );
    }
  };

  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await API.put(
        `/api/recruiter/notifications/${notificationId}/read`
      );

      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        setUnreadCount((prevCount) =>
          prevCount > 0 ? prevCount - 1 : 0
        );
      }
    } catch (error) {
      console.error(
        "Failed to mark recruiter notification as read:",
        error
      );
    }
  };

  // =========================================================
  // CLOSE NOTIFICATION DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* =====================================================
          LEFT
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome Back
        </p>
      </div>


{/* =====================================================
    SEARCH
===================================================== */}

<div className="relative w-80">

  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">

    <FaSearch className="text-gray-500" />

    <input
      type="text"
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search jobs..."
      className="bg-transparent outline-none ml-2 w-full"
    />

  </div>


  {/* SEARCH RESULTS */}

  {showSearchResults && (
    <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50">

      {searchResults.length === 0 ? (

        <div className="p-4 text-sm text-gray-500 text-center">
          No jobs found
        </div>

      ) : (

        <div className="max-h-80 overflow-y-auto">

          {searchResults.map((job) => (

            <div
              key={job.id}
              onClick={() => {
                setShowSearchResults(false);
                setSearch("");
                window.location.href = `/recruiter/jobs/${job.id}`;
              }}
              className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
            >

              <p className="font-semibold text-gray-800">
                {job.title}
              </p>

              {job.location && (
                <p className="text-sm text-gray-500 mt-1">
                  {job.location}
                </p>
              )}

              {job.required_skills && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {job.required_skills}
                </p>
              )}

            </div>

          ))}

        </div>

      )}

    </div>
  )}

</div>


      {/* =====================================================
          RIGHT
      ====================================================== */}

      <div className="flex items-center gap-5">


        {/* ===================================================
            NOTIFICATION BELL
        ==================================================== */}

        <div
          className="relative"
          ref={notificationRef}
        >

          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              fetchNotifications();
            }}
            className="relative text-gray-600 hover:text-blue-600 transition"
          >

            <FaBell className="text-2xl" />


            {/* UNREAD COUNT */}

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">

                {unreadCount}

              </span>
            )}

          </button>


          {/* =================================================
              NOTIFICATION DROPDOWN
          ================================================== */}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">

              {/* Header */}

              <div className="px-4 py-3 border-b flex justify-between items-center">

                <h3 className="font-semibold text-gray-800">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <span className="text-xs text-blue-600">
                    {unreadCount} unread
                  </span>
                )}

              </div>


              {/* Notification List */}

              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="px-4 py-8 text-center text-gray-500">
                    No notifications
                  </div>

                ) : (

                  notifications.map((notification) => (

                    <div
                      key={notification.id}
                      onClick={() => {
                        if (!notification.is_read) {
                          markNotificationAsRead(
                            notification.id
                          );
                        }
                      }}
                      className={`px-4 py-4 border-b cursor-pointer hover:bg-gray-50 ${
                        !notification.is_read
                          ? "bg-blue-50"
                          : "bg-white"
                      }`}
                    >

                      <div className="flex justify-between items-start">

                        <h4 className="font-semibold text-sm text-gray-800">
                          {notification.title}
                        </h4>

                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}

                      </div>


                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>


                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                  ))

                )}

              </div>

            </div>
          )}

        </div>


        {/* ===================================================
            RECRUITER PROFILE
        ==================================================== */}

        <div className="flex items-center gap-2">

          <FaUserCircle className="text-4xl text-blue-600" />

          <div>

            <p className="font-semibold">
              {profile?.name || "Recruiter"}
            </p>

            <p className="text-xs text-gray-500">
              {profile?.email || "Loading..."}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}