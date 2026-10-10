import { useEffect, useState } from "react";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  FaArrowLeft,
  FaUserTie,
  FaEnvelope,
  FaIdBadge,
} from "react-icons/fa";

export default function AdminRecruiterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [recruiter, setRecruiter] = useState(location.state?.recruiter || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchRecruiter = async () => {
    try {
      setLoading(true);
      setError("");

      // Get recruiter selected from Global Search
      const selectedRecruiter = location.state?.recruiter;

      if (
        selectedRecruiter &&
        String(selectedRecruiter.id) === String(id)
      ) {
        setRecruiter(selectedRecruiter);
        return;
      }

      // Recruiter was not passed through navigation
      setError(
        "Recruiter details are unavailable. Please open this recruiter from Global Search."
      );
    } catch (err) {
      console.error("Recruiter details error:", err);
      setError("Unable to load recruiter details.");
    } finally {
      setLoading(false);
    }
  };

  fetchRecruiter();
}, [id, location.state]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/recruiters")}
          className="mb-5 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          Back to Recruiters
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Recruiter Details
        </h1>

        <p className="mt-2 text-gray-500">
          View information about the selected recruiter.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          Loading recruiter details...
        </div>
      ) : error ? (
        <div className="rounded-xl bg-white p-8 text-center text-red-600 shadow-sm">
          {error}
        </div>
      ) : recruiter ? (
        <div className="max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600">
              <FaUserTie />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {recruiter.name || recruiter.full_name || "Unnamed Recruiter"}
              </h2>

              <p className="text-gray-500">
                Recruiter ID: #{recruiter.id}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-medium text-gray-800">
                {recruiter.name ||
                  recruiter.full_name ||
                  "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaEnvelope />
                Email Address
              </p>

              <p className="break-words font-medium text-gray-800">
                {recruiter.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaIdBadge />
                Role
              </p>

              <p className="font-medium text-gray-800">
                {recruiter.role || recruiter.type || "Recruiter"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-500">
                Account Status
              </p>

              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {recruiter.status || "Active"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}