import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaUserTie,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/jobs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              `Failed to fetch jobs. Server returned ${response.status}`
          );
        }

        const jobs = Array.isArray(data.jobs) ? data.jobs : [];

        const selectedJob = jobs.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedJob) {
          throw new Error("Job not found.");
        }

        setJob(selectedJob);
      } catch (err) {
        console.error("Fetch job details error:", err);
        setError(err.message || "Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/jobs")}
          className="mb-5 flex items-center gap-2 text-blue-600 transition hover:text-blue-800"
        >
          <FaArrowLeft />
          Back to Jobs
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Job Details
        </h1>

        <p className="mt-2 text-gray-500">
          View information about the selected job posting.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-gray-500">Loading job details...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          <p className="font-semibold">Unable to load job</p>
          <p className="mt-2 text-sm">{error}</p>

          <button
            onClick={() => navigate("/admin/jobs")}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Job Management
          </button>
        </div>
      ) : job ? (
        <div className="max-w-4xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-start gap-4 border-b border-gray-100 bg-gray-50 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
              <FaBriefcase />
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-800">
                {job.title || "Untitled Job"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Job ID: #{job.id}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  job.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {job.status || "Active"}
              </span>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaUserTie className="text-blue-600" />
                Recruiter
              </p>

              <p className="font-semibold text-gray-800">
                {job.recruiter_name || "Unknown"}
              </p>

              <p className="mt-1 break-words text-sm text-gray-500">
                {job.recruiter_email || "No email available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaMapMarkerAlt className="text-blue-600" />
                Location
              </p>

              <p className="font-semibold text-gray-800">
                {job.location || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaMoneyBillWave className="text-blue-600" />
                Salary
              </p>

              <p className="font-semibold text-gray-800">
                {job.salary || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-500">
                Experience Required
              </p>

              <p className="font-semibold text-gray-800">
                {job.experience || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FaUsers className="text-blue-600" />
                Applications
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {job.applications ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4 sm:col-span-2">
              <h3 className="mb-3 font-semibold text-gray-800">
                Job Description
              </h3>

              <p className="whitespace-pre-wrap leading-7 text-gray-600">
                {job.description || "No job description available."}
              </p>
            </div>

            {job.required_skills && (
              <div className="rounded-xl border border-gray-100 p-4 sm:col-span-2">
                <h3 className="mb-3 font-semibold text-gray-800">
                  Required Skills
                </h3>

                <p className="whitespace-pre-wrap leading-7 text-gray-600">
                  {Array.isArray(job.required_skills)
                    ? job.required_skills.join(", ")
                    : job.required_skills}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}