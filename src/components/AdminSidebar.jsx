import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">

      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="space-y-2">

        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-300
                     hover:bg-blue-600
                     hover:text-white
                     transition duration-200"
        >
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-300
                     hover:bg-blue-600
                     hover:text-white
                     transition duration-200"
        >
          <FaUsers />
          <span>Users</span>
        </Link>

        <Link
          to="/admin/jobs"
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-300
                     hover:bg-blue-600
                     hover:text-white
                     transition duration-200"
        >
          <FaBriefcase />
          <span>Jobs</span>
        </Link>

        <Link
          to="/admin/reports"
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-300
                     hover:bg-blue-600
                     hover:text-white
                     transition duration-200"
        >
          <FaFileAlt />
          <span>Reports</span>
        </Link>

        <Link
          to="/admin/analytics"
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-300
                     hover:bg-blue-600
                     hover:text-white
                     transition duration-200"
        >
          <FaChartBar />
          <span>Analytics</span>
        </Link>

        <Link
          to="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-300
                     hover:bg-blue-600
                     hover:text-white
                     transition duration-200"
        >
          <FaCog />
          <span>Settings</span>
        </Link>

      </nav>

    </aside>
  );
}