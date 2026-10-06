import { useEffect, useRef, useState } from "react";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import API from "../api/axios";

export default function AdminNavbar() {
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");

  const notificationRef = useRef(null);

  // =========================================================
  // FETCH ADMIN PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/auth/profile");

        console.log("ADMIN PROFILE RESPONSE:", response.data);

        if (response.data.user) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    fetchProfile();
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
  // FETCH ADMIN NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async () => {
    try {
      /*
       * Admin notification API will be connected here.
       */

      console.log("Admin notifications endpoint not connected yet.");
    } catch (error) {
      console.error(
        "Failed to fetch admin notifications:",
        error
      );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // =========================================================
  // NAVBAR
  // =========================================================

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">

      {/* =================================================
          Left Side
      ================================================= */}

      <div className="min-w-[220px]">

        <h1 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-xs text-gray-500">
          Welcome Back
        </p>

      </div>


      {/* =================================================
          Search Bar
      ================================================= */}

      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">

        <FaSearch className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />

      </div>


      {/* =================================================
          Right Side
      ================================================= */}

      <div className="flex items-center gap-6">

        {/* =================================================
            Notification
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
            className="relative text-gray-600 hover:text-blue-600 transition"
            title="Notifications"
          >

            <FaBell className="text-xl" />

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

              {/* Header */}

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
                      className={`px-4 py-4 border-b ${
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
            Admin Profile
        ================================================= */}

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-3xl text-blue-600" />

          <div>

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