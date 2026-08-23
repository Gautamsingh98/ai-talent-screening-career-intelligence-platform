import { useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import AdminUserDetailsModal from "./AdminUserDetailsModal";

export default function AdminUsersTable() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      role: "Candidate",
      date: "23 Aug 2026",
      status: "Active",
    },
    {
      name: "Priya Singh",
      email: "priya@gmail.com",
      role: "Candidate",
      date: "22 Aug 2026",
      status: "Active",
    },
    {
      name: "Tech Solutions Pvt. Ltd.",
      email: "hr@techsolutions.com",
      role: "Recruiter",
      date: "21 Aug 2026",
      status: "Active",
    },
    {
      name: "Rohan Gupta",
      email: "rohan@gmail.com",
      role: "Candidate",
      date: "20 Aug 2026",
      status: "Inactive",
    },
    {
      name: "AI Innovations",
      email: "hr@aiinnovations.com",
      role: "Recruiter",
      date: "19 Aug 2026",
      status: "Active",
    },
  ]);

  // Search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      role === "All" || user.role === role;

    return matchesSearch && matchesRole;
  });

  // Activate / Deactivate user
  const toggleUserStatus = (email) => {
    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      return;
    }

    const newStatus =
      user.status === "Active"
        ? "Inactive"
        : "Active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus === "Active"
          ? "activate"
          : "deactivate"
      } ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    const updatedUsers = users.map((user) =>
      user.email === email
        ? {
            ...user,
            status: newStatus,
          }
        : user
    );

    setUsers(updatedUsers);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* Search */}
        <div className="relative flex-1">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Role Filter */}
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">
            All Roles
          </option>

          <option value="Candidate">
            Candidates
          </option>

          <option value="Recruiter">
            Recruiters
          </option>
        </select>

      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b text-gray-500 text-sm">

              <th className="text-left py-3">
                User
              </th>

              <th className="text-left py-3">
                Email
              </th>

              <th className="text-center py-3">
                Role
              </th>

              <th className="text-center py-3">
                Registered
              </th>

              <th className="text-center py-3">
                Status
              </th>

              <th className="text-center py-3">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map((user) => (

                <tr
                  key={user.email}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  {/* Name */}
                  <td className="py-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  {/* Email */}
                  <td className="text-gray-600">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "Candidate"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  {/* Date */}
                  <td className="text-center text-gray-600">
                    {user.date}
                  </td>

                  {/* Status */}
                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="text-center">

                    <div className="flex justify-center items-center gap-3">

                      {/* View User */}
                      <button
                        onClick={() =>
                          setSelectedUser(user)
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="View User"
                      >
                        <FaEye />
                      </button>

                      {/* Activate / Deactivate */}
                      <button
                        onClick={() =>
                          toggleUserStatus(user.email)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {user.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-500"
                >
                  No users found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* User Details Modal */}
      <AdminUserDetailsModal
        user={selectedUser}
        onClose={() =>
          setSelectedUser(null)
        }
      />

    </div>
  );
}