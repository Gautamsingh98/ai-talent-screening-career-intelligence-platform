import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

import {
  FaArrowLeft,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaTools,
} from "react-icons/fa";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching recruiter job:", id);

        const response = await API.get(
          `/api/recruiter/jobs/${id}`
        );

        console.log("JOB DETAILS RESPONSE:", response.data);

        if (response.data.success && response.data.job) {
          setJob(response.data.job);
        } else {
          setError(
            response.data.message || "Unable to load job details."
          );
        }

      } catch (error) {
        console.error("JOB DETAILS ERROR:", error);
        console.error(
          "ERROR RESPONSE:",
          error.response?.data
        );

        setError(
          error.response?.data?.message ||
          "Failed to load job details."
        );

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    } else {
      setError("Job ID is missing.");
      setLoading(false);
    }
  }, [id]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading job details...
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">
          {error}
        </p>

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  // =========================================================
  // JOB NOT AVAILABLE
  // =========================================================

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">
          Job details are unavailable.
        </p>

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  // =========================================================
  // JOB DETAILS
  // =========================================================

  return (
    <div className="p-6">

{/* Header */}
<div className="mb-6">

  {/* Back Button */}
  <button
    onClick={() => navigate("/recruiter/jobs")}
    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-4"
  >
    <FaArrowLeft className="text-lg" />
    <span className="font-medium">Back</span>
  </button>

  {/* Page Title */}
  <div>
    <h1 className="text-2xl font-bold text-gray-800">
      Job Details
    </h1>

    <p className="text-gray-500 text-sm mt-1">
      View your posted job information
    </p>
  </div>

</div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

        {/* Job Header */}
        <div className="flex items-start justify-between mb-6">

          <div>

            <div className="flex items-center gap-3">

              <FaBriefcase className="text-blue-600 text-xl" />

              <h2 className="text-2xl font-bold text-gray-800">
                {job.title}
              </h2>

            </div>

            <p className="text-gray-500 mt-2">
              Posted on{" "}
              {job.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : "N/A"}
            </p>

          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {job.status}
          </span>

        </div>

        {/* Job Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Location */}
          <div className="bg-gray-50 rounded-lg p-4">

            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FaMapMarkerAlt />
              <span className="text-sm">
                Location
              </span>
            </div>

            <p className="font-semibold text-gray-800">
              {job.location || "Not specified"}
            </p>

          </div>

          {/* Salary */}
          <div className="bg-gray-50 rounded-lg p-4">

            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FaMoneyBillWave />
              <span className="text-sm">
                Salary
              </span>
            </div>

            <p className="font-semibold text-gray-800">
              {job.salary || "Not specified"}
            </p>

          </div>

          {/* Experience */}
          <div className="bg-gray-50 rounded-lg p-4">

            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FaClock />
              <span className="text-sm">
                Experience
              </span>
            </div>

            <p className="font-semibold text-gray-800">
              {job.experience || "Not specified"}
            </p>

          </div>

          {/* Skills */}
          <div className="bg-gray-50 rounded-lg p-4">

            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FaTools />
              <span className="text-sm">
                Required Skills
              </span>
            </div>

            <p className="font-semibold text-gray-800">
              {job.required_skills || "Not specified"}
            </p>

          </div>

        </div>

        {/* Description */}
        <div className="mb-8">

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Job Description
          </h3>

          <div className="bg-gray-50 rounded-lg p-5 text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description || "No description provided."}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            onClick={() =>
              navigate(`/recruiter/jobs/${job.id}/edit`)
            }
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Job
          </button>

          <button
            onClick={() =>
              navigate(`/recruiter/jobs/${job.id}/applicants`)
            }
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            View Applicants
          </button>

        </div>

      </div>
    </div>
  );
}