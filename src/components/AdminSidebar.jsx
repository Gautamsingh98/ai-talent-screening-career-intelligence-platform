import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">

      {/* Logo / Title */}
      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      {/* Menu */}
      <nav className="space-y-2">

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <FaHome />
          <span>Dashboard</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <FaUsers />
          <span>Users</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <FaBriefcase />
          <span>Jobs</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <FaFileAlt />
          <span>Reports</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <FaChartBar />
          <span>Analytics</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <FaCog />
          <span>Settings</span>
        </div>

      </nav>

    </aside>
  );
}