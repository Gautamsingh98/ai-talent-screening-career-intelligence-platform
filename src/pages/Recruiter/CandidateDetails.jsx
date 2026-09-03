import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
  FaClock,
  FaSave,
} from "react-icons/fa";

export default function CandidateDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Application status
  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // FETCH CANDIDATE DETAILS
  // =========================

  const fetchCandidate = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/api/recruiter/applicants/${applicationId}/resume`
      );

      const data = response.data.resume;

      setCandidate(data);

      // Backend returns application_status
      setStatus(data.application_status || "Applied");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load candidate details"
      );
      } finally {
    setLoading(false);
  }
}, [applicationId]);

  // =========================
  // VIEW RESUME
  // =========================

  const handleViewResume = async () => {
    try {
      setError("");

      const response = await API.get(
        `/api/recruiter/applicants/${applicationId}/resume/file`,
        {
          responseType: "blob",
        }
      );

      // Create temporary URL for PDF
      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      // Open PDF in a new browser tab
      window.open(fileURL, "_blank");

      // Clean up temporary URL
      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
      }, 10000);
    } catch (err) {
      console.error("Resume viewing error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to open resume."
      );
    }
  };

  // =========================
  // UPDATE APPLICATION STATUS
  // =========================

  const handleStatusUpdate = async () => {
    try {
      setUpdatingStatus(true);
      setError("");
      setSuccessMessage("");

      await API.put(
        `/api/recruiter/applicants/${applicationId}/status`,
        {
          status: status,
        }
      );

      // Update local candidate data
      setCandidate((prev) => ({
        ...prev,
        application_status: status,
      }));

      setSuccessMessage(
        "Application status updated successfully."
      );

      // Remove success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update application status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

useEffect(() => {
  fetchCandidate();
}, [fetchCandidate]);

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "Applied":
        return "bg-blue-100 text-blue-700";

      case "Shortlisted":
        return "bg-yellow-100 text-yellow-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      case "Hired":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="p-8 text-center">
          <p className="text-gray-600 text-lg">
            Loading candidate details...
          </p>
        </div>
      </RecruiterLayout>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !candidate) {
    return (
      <RecruiterLayout>
        <div className="p-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </RecruiterLayout>
    );
  }

  if (!candidate) {
    return (
      <RecruiterLayout>
        <div className="p-8">
          <p>No candidate information found.</p>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="p-6">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Candidate Details
            </h1>

            <p className="text-gray-500 mt-1">
              View candidate information, application status and resume
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <FaArrowLeft />
            Back
          </button>

        </div>

        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && candidate && (
          <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* =========================
            CANDIDATE PROFILE
        ========================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* Candidate Information */}

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600 text-2xl" />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  {candidate.candidate_name || candidate.name}
                </h2>

                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <FaEnvelope />
                  {candidate.candidate_email || candidate.email}
                </div>

              </div>

            </div>

            {/* Current Status */}

            <div className="flex flex-col items-start md:items-end gap-2">

              <p className="text-sm text-gray-500">
                Current Application Status
              </p>

              <span
                className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                  candidate.application_status
                )}`}
              >
                {candidate.application_status || "Applied"}
              </span>

            </div>

          </div>

        </div>

        {/* =========================
            APPLICATION STATUS
        ========================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <FaClock className="text-blue-600 text-xl" />

            <h2 className="text-xl font-bold text-gray-800">
              Application Status
            </h2>

          </div>

          <div className="flex flex-col md:flex-row gap-4">

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
            >
              <option value="Applied">
                Applied
              </option>

              <option value="Shortlisted">
                Shortlisted
              </option>

              <option value="Interview">
                Interview
              </option>

              <option value="Hired">
                Hired
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

            <button
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-semibold"
            >
              <FaSave />

              {updatingStatus
                ? "Updating..."
                : "Update Status"}
            </button>

          </div>

        </div>

        {/* =========================
            MATCH INFORMATION
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* MATCH */}

          <div className="bg-white rounded-xl shadow-md p-6">

  <div className="flex items-center justify-between mb-3">

    <div className="flex items-center gap-3">

      <FaPercentage className="text-blue-600 text-xl" />

      <h3 className="font-semibold text-gray-700">
        Match Percentage
      </h3>

    </div>

    <span className="text-2xl font-bold text-blue-600">
      {candidate.match_percentage ?? 0}%
    </span>

  </div>

  {/* Progress Bar */}

  <div className="w-full bg-gray-200 rounded-full h-3">

    <div
      className="bg-blue-600 h-3 rounded-full transition-all duration-700"
      style={{
        width: `${Math.min(
          Math.max(
            Number(candidate.match_percentage) || 0,
            0
          ),
          100
        )}%`,
      }}
    ></div>

  </div>

  <p className="text-sm text-gray-500 mt-2">
    Resume match with job requirements
  </p>

</div>

          {/* MATCHED SKILLS */}

          <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-3">

              <FaCheckCircle className="text-green-600 text-xl" />

              <h3 className="font-semibold text-gray-700">
                Matched Skills
              </h3>

            </div>

            <div className="flex flex-wrap gap-2">

              {(candidate.matched_skills || []).length > 0 ? (
                candidate.matched_skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-gray-500 text-sm">
                  No matched skills
                </p>
              )}

            </div>

          </div>

          {/* MISSING SKILLS */}

          <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-3">

              <FaTimesCircle className="text-red-600 text-xl" />

              <h3 className="font-semibold text-gray-700">
                Missing Skills
              </h3>

            </div>

            <div className="flex flex-wrap gap-2">

              {(candidate.missing_skills || []).length > 0 ? (
                candidate.missing_skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-gray-500 text-sm">
                  No missing skills
                </p>
              )}

            </div>

          </div>

        </div>

        {/* =========================
            RESUME
        ========================= */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <div className="flex items-center gap-3 mb-4">

            <FaFileAlt className="text-purple-600 text-xl" />

            <h2 className="text-xl font-bold text-gray-800">
              Resume
            </h2>

          </div>

          {candidate.original_filename ? (

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              {/* Resume Information */}

              <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3">

                <FaFilePdf className="text-red-600 text-2xl" />

                <div>

                  <p className="font-semibold text-gray-700">
                    {candidate.original_filename}
                  </p>

                  {candidate.uploaded_at && (
                    <p className="text-sm text-gray-500">
                      Uploaded:{" "}
                      {new Date(
                        candidate.uploaded_at
                      ).toLocaleDateString()}
                    </p>
                  )}

                </div>

              </div>

              {/* View Resume Button */}

              <button
                onClick={handleViewResume}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                <FaFilePdf />
                View Resume
              </button>

            </div>

          ) : (

            <p className="text-gray-500">
              Resume not available.
            </p>

          )}

        </div>

      </div>
    </RecruiterLayout>
  );
}