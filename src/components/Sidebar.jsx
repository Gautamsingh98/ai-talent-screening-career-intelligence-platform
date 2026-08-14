import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaRobot,
  FaChartBar,
  FaGraduationCap,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/candidate/dashboard",
    },
    {
      name: "My Profile",
      icon: <FaUser />,
      path: "/candidate/profile",
    },
    {
      name: "My Resume",
      icon: <FaFileAlt />,
      path: "/candidate/resume",
    },
    {
      name: "Browse Jobs",
      icon: <FaBriefcase />,
      path: "/candidate/jobs",
    },
    {
      name: "Applied Jobs",
      icon: <FaClipboardList />,
      path: "/candidate/applied-jobs",
    },
    {
      name: "Resume Analysis",
      icon: <FaRobot />,
      path: "/candidate/resume-analysis",
    },
    {
      name: "Skill Gap",
      icon: <FaChartBar />,
      path: "/candidate/skill-gap",
    },
    {
      name: "Career Recommendation",
      icon: <FaGraduationCap />,
      path: "/candidate/career",
    },
    {
      name: "Practice Interview",
      icon: <FaRobot />,
      path: "/candidate/interview",
    },
    {
      name: "Reports",
      icon: <FaFileAlt />,
      path: "/candidate/reports",
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