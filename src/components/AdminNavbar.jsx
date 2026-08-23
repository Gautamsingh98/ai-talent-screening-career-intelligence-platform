import { FaBell, FaUserCircle } from "react-icons/fa";

export default function AdminNavbar() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">

      {/* Left Side */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button
          className="relative text-gray-600 hover:text-blue-600"
          title="Notifications"
        >
          <FaBell className="text-xl" />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-gray-500" />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}