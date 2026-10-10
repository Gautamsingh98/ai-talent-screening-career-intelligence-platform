import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaUserTag,
} from "react-icons/fa";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

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
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();

        const selectedUser = (data.users || []).find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedUser) {
          throw new Error("User not found.");
        }

        setUser(selectedUser);
      } catch (err) {
        console.error("User details error:", err);
        setError(err.message || "Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/users")}
          className="mb-5 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          Back to Users
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          User Details
        </h1>

        <p className="mt-2 text-gray-500">
          View information about the selected user.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          Loading user details...
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-white p-10 text-center text-red-600 shadow-sm">
          {error}
        </div>
      ) : user ? (
        <div className="max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600">
              <FaUser />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name || "Unnamed User"}
              </h2>

              <p className="text-gray-500">
                User ID: #{user.id}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-medium text-gray-800">
                {user.name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaEnvelope />
                Email Address
              </p>

              <p className="break-words font-medium text-gray-800">
                {user.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaUserTag />
                Role
              </p>

              <p className="font-medium text-gray-800">
                {user.role || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-500">
                Account Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  (user.status || "Active") === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status || "Active"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}