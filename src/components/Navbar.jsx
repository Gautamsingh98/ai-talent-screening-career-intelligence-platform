import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [profile, setProfile] = useState(null);

  // =========================================================
  // SEARCH
  // =========================================================

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await API.get(
        `/api/candidate/jobs?search=${encodeURIComponent(value)}`
      );

      if (response.data.success) {
        setSearchResults(response.data.jobs);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowSearchResults(true);
    }
  };

  // =========================================================
  // FETCH CANDIDATE PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/auth/profile");

        console.log("PROFILE RESPONSE:", response.data);

        if (response.data.user) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch candidate profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // =========================================================
  // FETCH UNREAD COUNT
  // =========================================================

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await API.get(
          "/api/candidate/notifications/unread-count"
        );

        if (response.data.success) {
          setUnreadCount(response.data.unread_count);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  // =========================================================
  // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // FETCH ALL NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async () => {
    try {
      const response = await API.get(
        "/api/candidate/notifications/"
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await API.put(
        `/api/candidate/notifications/${notificationId}/read`
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
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // =========================================================
  // NAVBAR
  // =========================================================

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Candidate Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome Back
        </p>
      </div>

      {/* =================================================
          SEARCH BAR
      ================================================= */}

      <div className="relative w-80">

        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">

          <FaSearch className="text-gray-500" />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search jobs"
            className="bg-transparent outline-none ml-2 w-full"
          />

        </div>

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {showSearchResults && (
          <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50">

            {searchResults.length === 0 ? (

              <div className="p-4 text-sm text-gray-500 text-center">
                No jobs found
              </div>

            ) : (

              <div className="max-h-80 overflow-y-auto">

                {searchResults.map((job) => (

                  <Link
                    key={job.id}
                    to={`/candidate/jobs/${job.id}`}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearch("");
                    }}
                    className="block px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition"
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

                  </Link>

                ))}

              </div>

            )}

          </div>
        )}

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* =================================================
            Notification Bell
        ================================================= */}

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              fetchNotifications();
            }}
            className="relative cursor-pointer"
          >

            <FaBell className="text-2xl text-gray-600 hover:text-blue-600 transition" />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}

          </button>

          {/* =================================================
              Notification Dropdown
          ================================================= */}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">

              {/* Dropdown Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b">

                <h3 className="font-semibold text-gray-800">
                  Notifications
                </h3>

                <span className="text-sm text-gray-500">
                  {unreadCount} unread
                </span>

              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="p-6 text-center text-gray-500">
                    No notifications
                  </div>

                ) : (

                  notifications.map((notification) => (

                    <div
                      key={notification.id}
                      onClick={() => {
                        if (!notification.is_read) {
                          markNotificationAsRead(notification.id);
                        }
                      }}
                      className={`px-4 py-4 border-b hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read
                          ? "bg-blue-50"
                          : "bg-white"
                      }`}
                    >

                      <p className="font-semibold text-gray-800">
                        {notification.title}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {notification.created_at}
                      </p>

                    </div>

                  ))

                )}

              </div>

            </div>
          )}

        </div>

        {/* =================================================
            Candidate Profile
        ================================================= */}

        <Link
          to="/candidate/profile"
          className="flex items-center gap-2 cursor-pointer"
        >

          <FaUserCircle className="text-4xl text-blue-600" />

          <div>

            <p className="font-semibold">
              {profile?.name || "Candidate"}
            </p>

            <p className="text-xs text-gray-500">
              {profile?.email || "candidate@email.com"}
            </p>

          </div>

        </Link>

      </div>

    </header>
  );
}