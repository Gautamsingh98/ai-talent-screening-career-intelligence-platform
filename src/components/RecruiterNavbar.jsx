
import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";

export default function RecruiterNavbar() {
  const [profile, setProfile] = useState(null);

  // Search states
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Notification states
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // =========================================================
  // SEARCH JOBS, CANDIDATES, APPLICATIONS, AND RESUMES
  // =========================================================

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchLoading(false);
      return;
    }

    setShowSearchResults(true);
    setSearchLoading(true);

    try {
      const response = await API.get(
        `/api/recruiter/search?q=${encodeURIComponent(value.trim())}`
      );

      if (response.data.success) {
        setSearchResults(response.data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Recruiter global search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================================================
  // OPEN SEARCH RESULT
  // =========================================================

  const openSearchResult = (result) => {
    setShowSearchResults(false);
    setSearch("");
    setSearchResults([]);

    switch (result.type) {
      case "Job":
        window.location.href = `/recruiter/jobs/${result.id}`;
        break;

      case "Candidate":
        window.location.href = `/recruiter/candidates/${result.id}`;
        break;

      case "Application":
        window.location.href = `/recruiter/applications/${result.id}`;
        break;

      case "Resume":
        window.location.href = `/recruiter/resumes/${result.id}`;
        break;

      default:
        console.error("Unknown search result type:", result.type);
    }
  };

  // =========================================================
  // FETCH LOGGED-IN RECRUITER PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/auth/profile");
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // CLOSE SEARCH DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleSearchClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleSearchClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleSearchClickOutside
      );
    };
  }, []);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center gap-6">

      {/* LEFT: DASHBOARD TITLE */}

      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome Back
        </p>
      </div>

      {/* =====================================================
          GLOBAL SEARCH
      ====================================================== */}

      <div
        className="relative w-[500px] max-w-full flex-shrink-0"
        ref={searchRef}
      >
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
          <FaSearch className="text-gray-500 shrink-0" />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (search.trim()) {
                setShowSearchResults(true);
              }
            }}
            placeholder="Search jobs, candidates, applications, resumes.."
            className="bg-transparent outline-none ml-2 w-full text-base"
          />
        </div>

        {/* SEARCH RESULTS */}

        {showSearchResults && (
          <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50">

            {searchLoading ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No matching jobs, candidates, applications, or resumes found.
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    type="button"
                    onClick={() => openSearchResult(result)}
                    className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-gray-800 text-sm">
                        {result.title}
                      </p>

                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded shrink-0">
                        {result.type}
                      </span>
                    </div>

                    {result.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">
                        {result.subtitle}
                      </p>
                    )}

                    {result.details && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {result.details}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          RIGHT: NOTIFICATIONS AND PROFILE
      ====================================================== */}

      <div className="flex items-center gap-5 shrink-0">

        {/* NOTIFICATION BELL */}

        <div
          className="relative"
          ref={notificationRef}
        >
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              fetchNotifications();
            }}
            className="relative text-gray-600 hover:text-blue-600 transition"
          >
            <FaBell className="text-2xl" />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50">

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
                          markNotificationAsRead(notification.id);
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
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
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

        {/* RECRUITER PROFILE */}

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