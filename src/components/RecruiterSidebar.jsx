import {
  FaTachometerAlt,
  FaBriefcase,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function RecruiterSidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/recruiter/dashboard",
    },
    {
      name: "My Jobs",
      icon: <FaBriefcase />,
      path: "/recruiter/jobs",
    },
    {
      name: "Applicants",
      icon: <FaUsers />,
      path: "/recruiter/applicants",
    },
    {
      name: "Reports",
      icon: <FaFileAlt />,
      path: "/recruiter/reports",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/recruiter/analytics",
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-center">
          AI Talent Screening
        </h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </div>
  );
}