
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSearch, FaTimes } from "react-icons/fa";
import API from "../api/axios";

export default function AdminNavbar() {
  const [profile, setProfile] = useState(null);
  const [unreadCount] = useState(0);
  const [notifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/auth/profile");

        if (response.data.user) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Notifications placeholder
  const fetchNotifications = async () => {
    try {
      // Connect this to the Admin notification API when available.
      console.log("Admin notifications endpoint not connected yet.");
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    }
  };

  // Admin search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Search endpoint will be added in the backend step.
    setShowSearchResults(true);
    setSearchLoading(true);

    try {
      const response = await API.get(
        `/api/admin/search?q=${encodeURIComponent(value.trim())}`
      );

      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Admin search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

const openSearchResult = (result) => {
  // Close search dropdown
  setShowSearchResults(false);
  setSearch("");
  setSearchResults([]);

  // Navigate to the selected record
  switch (result.type) {
    case "Candidate":
      navigate(`/admin/users/${result.id}`);
      break;

    case "Recruiter":
      navigate(`/admin/recruiters/${result.id}`,{
      state: { recruiter: result }, 
      });
      break;

    case "User":
      navigate(`/admin/users/${result.id}`);
      break;

    case "Job":
      navigate(`/admin/jobs/${result.id}`);
      break;

    default:
      navigate("/admin/dashboard");
  }
};

  return (
    <header className="min-h-16 bg-white shadow-sm flex items-center justify-between gap-6 px-4 lg:px-8 py-3">

      {/* Left side */}
      <div className="min-w-[170px]">
        <h1 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-xs text-gray-500">Welcome Back</p>
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative w-full max-w-md">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2.5">
          <FaSearch className="text-gray-500 shrink-0" />

          <input
            type="text"
            placeholder="Search users, recruiters, jobs..."
            value={search}
            onChange={handleSearch}
            onFocus={() => {
              if (search.trim()) setShowSearchResults(true);
            }}
            className="bg-transparent outline-none ml-2 w-full text-base"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchResults([]);
                setShowSearchResults(false);
              }}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold text-gray-700">
                Search Results
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {searchLoading ? (
                <p className="p-4 text-sm text-gray-500">
                  Searching...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">
                  No matching results found.
                </p>
              ) : (
                searchResults.map((result) => (
                  <button
                    type="button"
                    key={`${result.type}-${result.id}`}
                    onClick={() => openSearchResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {result.name || result.title || "Unnamed result"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {result.email || result.description || result.type}
                      {" · "}
                      {result.type}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 lg:gap-6 shrink-0">

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((current) => !current);
              fetchNotifications();
            }}
            className="relative text-gray-600 hover:text-blue-600 transition"
            title="Notifications"
          >
            <FaBell className="text-xl" />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-800">
                  Notifications
                </h3>
                <span className="text-sm text-gray-500">
                  {unreadCount} unread
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-4 border-b ${
                        !notification.is_read ? "bg-blue-50" : "bg-white"
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

        {/* Admin profile */}
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-blue-600" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {profile?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">
              {profile?.email || "admin@email.com"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}