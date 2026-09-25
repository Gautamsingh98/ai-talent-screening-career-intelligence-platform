import { useEffect, useState } from "react";

import {
  FaUser,
  FaUserTie,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

export default function AdminRecentUsers() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH RECENT USERS
  // =====================================================

  useEffect(() => {

    const fetchRecentUsers = async () => {

      try {

        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/users/recent",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {

          throw new Error(
            "Failed to fetch recent users"
          );

        }

        const data = await response.json();

        setUsers(data.users || []);

      } catch (err) {

        console.error(
          "Recent users error:",
          err
        );

        setError(
          "Unable to load recent users."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchRecentUsers();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="bg-white border rounded-xl shadow-sm p-6 mt-8">

        <h2 className="text-xl font-semibold text-gray-800">
          Recent Users
        </h2>

        <p className="text-gray-500 mt-4">
          Loading users...
        </p>

      </div>

    );

  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="bg-white border rounded-xl shadow-sm p-6 mt-8">

        <h2 className="text-xl font-semibold text-gray-800">
          Recent Users
        </h2>

        <p className="text-red-500 mt-4">
          {error}
        </p>

      </div>

    );

  }

  return (

    <div className="bg-white border rounded-xl shadow-sm p-6 mt-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-semibold text-gray-800">
            Recent Users
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Recently registered users on the platform
          </p>

        </div>

        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">

          <FaUser />

        </div>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {users.length === 0 ? (

        <div className="py-10 text-center">

          <FaUser
            className="mx-auto text-gray-300"
            size={40}
          />

          <p className="text-gray-500 mt-3">
            No users found.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left">

                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Email
                </th>

                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Role
                </th>

                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Registered
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >

                  {/* USER */}

                  <td className="py-4 px-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                        {user.role === "Recruiter" ? (

                          <FaUserTie className="text-purple-600" />

                        ) : (

                          <FaUser className="text-blue-600" />

                        )}

                      </div>

                      <div>

                        <p className="font-medium text-gray-800">

                          {user.name}

                        </p>

                        <p className="text-xs text-gray-400">

                          ID #{user.id}

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* EMAIL */}

                  <td className="py-4 px-4">

                    <div className="flex items-center gap-2 text-gray-600">

                      <FaEnvelope
                        className="text-gray-400"
                      />

                      <span className="text-sm">
                        {user.email}
                      </span>

                    </div>

                  </td>

                  {/* ROLE */}

                  <td className="py-4 px-4">

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "Recruiter"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >

                      {user.role}

                    </span>

                  </td>

                  {/* DATE */}

                  <td className="py-4 px-4">

                    <div className="flex items-center gap-2 text-gray-500">

                      <FaCalendarAlt
                        className="text-gray-400"
                      />

                      <span className="text-sm">

                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString()
                          : "N/A"}

                      </span>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}