import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaPowerOff,
} from "react-icons/fa";

export default function Users() {

  // =====================================================
  // STATES
  // =====================================================

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // FETCH USERS
  // =====================================================

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/users",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        setUsers(data.users || []);

      } catch (error) {

        console.error("Users error:", error);

        setError("Unable to load users.");

      } finally {

        setLoading(false);

      }

    };

    fetchUsers();

  }, []);


  // =====================================================
  // ACTIVATE / DEACTIVATE USER
  // =====================================================
  // ADD THIS FUNCTION HERE
  // BEFORE filteredUsers AND BEFORE return()
  // =====================================================

  const handleStatusChange = async (
    userId,
    currentStatus
  ) => {

    try {

      const token = localStorage.getItem("token");

      // Change Active → Inactive
      // Change Inactive → Active

      const newStatus =
        currentStatus === "Active"
          ? "Inactive"
          : "Active";


      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to update user status"
        );

      }


      // Update the user immediately
      // without refreshing the page

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: newStatus,
              }
            : user
        )
      );


    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      alert(
        "Failed to update user status."
      );

    }

  };


  // =====================================================
  // SEARCH + ROLE FILTER
  // =====================================================

  const filteredUsers = users.filter((user) => {

    const searchText =
      search.toLowerCase();


    const matchesSearch =
      user.name
        ?.toLowerCase()
        .includes(searchText) ||

      user.email
        ?.toLowerCase()
        .includes(searchText);


    const matchesRole =
      role === "All" ||
      user.role === role;


    return (
      matchesSearch &&
      matchesRole
    );

  });


  // =====================================================
  // RETURN / UI
  // =====================================================

  return (

    <AdminLayout>

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Users Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage candidates and recruiters on the platform.
        </p>

      </div>


      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          {/* SEARCH */}

          <div className="relative flex-1">

            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                border
                border-gray-200
                rounded-lg
                pl-11
                pr-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>


          {/* ROLE FILTER */}

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="
              border
              border-gray-200
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
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

      </div>


      {/* ================================================= */}
      {/* USERS TABLE */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">


        {/* LOADING */}

        {loading && (

          <div className="p-10 text-center text-gray-500">
            Loading users...
          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="p-10 text-center text-red-500">
            {error}
          </div>

        )}


        {/* TABLE */}

        {!loading &&
          !error &&
          filteredUsers.length > 0 && (

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEADER */}

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    {/* NEW STATUS COLUMN */}

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>


                {/* TABLE BODY */}

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="
                        border-t
                        border-gray-100
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {/* ID */}

                      <td className="px-6 py-4 text-gray-600">

                        #{user.id}

                      </td>


                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              w-10
                              h-10
                              rounded-full
                              bg-blue-100
                              text-blue-600
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <FaUser />

                          </div>

                          <span className="font-medium text-gray-800">

                            {user.name}

                          </span>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-600">

                          <FaEnvelope className="text-gray-400" />

                          {user.email}

                        </div>

                      </td>


                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium

                            ${
                              user.role === "Recruiter"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }
                          `}
                        >

                          <FaUserTag />

                          {user.role}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium

                            ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >

                          {user.status || "Active"}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              user.status || "Active"
                            )
                          }
                          className={`
                            px-3
                            py-2
                            rounded-lg
                            text-sm
                            font-medium
                            transition

                            ${
                              user.status === "Active"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }
                          `}
                        >

                          <span className="flex items-center gap-2">

                            <FaPowerOff />

                            {user.status === "Active"
                              ? "Deactivate"
                              : "Activate"}

                          </span>

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}


        {/* NO USERS */}

        {!loading &&
          !error &&
          filteredUsers.length === 0 && (

            <div className="p-10 text-center text-gray-500">

              No users found.

            </div>

          )}

      </div>

    </AdminLayout>

  );

}