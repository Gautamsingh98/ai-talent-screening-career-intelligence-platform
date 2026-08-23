import { FaEye } from "react-icons/fa";

export default function AdminRecentUsers() {
  const users = [
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
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Users
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Recently registered candidates and recruiters
          </p>
        </div>

        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>

      </div>

      {/* Table */}
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

            {users.map((user, index) => (

              <tr
                key={index}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >

                {/* User */}
                <td className="py-4">

                  <p className="font-medium text-gray-800">
                    {user.name}
                  </p>

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

                {/* Action */}
                <td className="text-center">

                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View User"
                  >
                    <FaEye />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}