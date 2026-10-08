import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaUser,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";

export default function Applicants() {
  // =========================
  // URL PARAMETER
  // =========================

  const { id: jobId } = useParams();
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");

  // =========================
  // FETCH APPLICANTS
  // =========================

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/api/recruiter/applicants"
      );

      const allApplicants =
        response.data.applicants || [];

      // If opened from a specific job,
      // show only applicants for that job.
      if (jobId) {
        const jobApplicants = allApplicants.filter(
          (applicant) =>
            String(applicant.job_id) === String(jobId)
        );

        setApplicants(jobApplicants);

        // Automatically select this job in the filter
        setJobFilter(jobId);
      } else {
        // General applicants page
        setApplicants(allApplicants);
        setJobFilter("All");
      }

    } catch (err) {
      console.error(
        "Failed to fetch applicants:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load applicants."
      );

    } finally {
      setLoading(false);
    }
  }, [jobId]);

  // =========================
  // LOAD APPLICANTS
  // =========================

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // =========================
  // UPDATE APPLICATION STATUS
  // =========================

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const response = await API.put(
        `/api/recruiter/applicants/${applicationId}/status`,
        {
          status: newStatus,
        }
      );

      // Update status immediately
      setApplicants((currentApplicants) =>
        currentApplicants.map((applicant) =>
          applicant.id === applicationId
            ? {
                ...applicant,
                status: newStatus,
              }
            : applicant
        )
      );

      alert(
        response.data.message ||
          "Application status updated successfully"
      );

    } catch (err) {
      console.error(
        "Failed to update status:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update application status."
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";

      case "Shortlisted":
        return "bg-green-100 text-green-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Hired":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // FILTER APPLICANTS
  // =========================

  const filteredApplicants = applicants.filter(
    (applicant) => {
      const searchText = search
        .trim()
        .toLowerCase();

      const candidateName =
        applicant.candidate_name
          ?.toLowerCase() || "";

      const candidateEmail =
        applicant.candidate_email
          ?.toLowerCase() || "";

      // Search by candidate name or email
      const matchesSearch =
        candidateName.includes(searchText) ||
        candidateEmail.includes(searchText);

      // Filter by status
      const matchesStatus =
        statusFilter === "All" ||
        applicant.status === statusFilter;

      // Filter by job
      const matchesJob =
        jobFilter === "All" ||
        String(applicant.job_id) ===
          String(jobFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob
      );
    }
  );

  // =========================
  // UNIQUE JOBS
  // =========================

  const uniqueJobs = [
    ...new Map(
      applicants
        .filter((applicant) => applicant.job_id)
        .map((applicant) => [
          applicant.job_id,
          applicant.job_title,
        ])
    ),
  ];

  // =========================
  // RESET FILTERS
  // =========================

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("All");

    // Keep selected job when viewing
    // applicants for a specific job.
    if (jobId) {
      setJobFilter(jobId);
    } else {
      setJobFilter("All");
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <RecruiterLayout>

      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">

        {/* Back to Job Details */}
        {jobId && (
          <button
            onClick={() =>
              navigate(`/recruiter/jobs/${jobId}`)
            }
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-4"
          >
            <FaArrowLeft />

            <span className="font-medium">
              Back to Job Details
            </span>
          </button>
        )}

        <h1 className="text-3xl font-bold text-gray-800">
          {jobId
            ? "Job Applicants"
            : "Applicants"}
        </h1>

        <p className="text-gray-500 mt-2">
          {jobId
            ? "View candidates who applied for this job and manage their application status."
            : "View candidates who have applied for your jobs and manage their application status."}
        </p>

      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <p className="text-gray-500">
            Loading applicants...
          </p>

        </div>

      ) : applicants.length === 0 ? (

        /* =========================
           NO APPLICANTS
        ========================= */

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <FaUser
            className="text-gray-300 text-5xl mx-auto mb-4"
          />

          <h2 className="text-xl font-bold text-gray-700">
            No Applicants Yet
          </h2>

          <p className="text-gray-500 mt-2">
            {jobId
              ? "No candidates have applied for this job yet."
              : "Candidates who apply for your jobs will appear here."}
          </p>

        </div>

      ) : (

        <>

          {/* =========================
              SEARCH & FILTERS
          ========================= */}

          <div className="bg-white rounded-xl shadow-md p-5 mb-6">

            <div className="flex items-center gap-2 mb-4">

              <h2 className="font-semibold text-gray-800">
                Search & Filters
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* SEARCH */}

              <div className="relative">

                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search candidate..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* STATUS FILTER */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="All">
                  All Statuses
                </option>

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

              {/* JOB FILTER */}

              <select
                value={jobFilter}
                onChange={(e) =>
                  setJobFilter(e.target.value)
                }
                disabled={!!jobId}
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >

                <option value="All">
                  All Jobs
                </option>

                {uniqueJobs.map(
                  ([jobIdValue, jobTitle]) => (

                    <option
                      key={jobIdValue}
                      value={jobIdValue}
                    >
                      {jobTitle}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* FILTER RESULTS */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-5">

              <p className="text-sm text-gray-500">

                Showing{" "}

                <span className="font-semibold text-gray-800">
                  {filteredApplicants.length}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-gray-800">
                  {applicants.length}
                </span>

                {" "}applicants

              </p>

              {/* RESET */}

              {(search ||
                statusFilter !== "All") && (

                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset Filters
                </button>

              )}

            </div>

          </div>

          {/* =========================
              NO FILTER RESULTS
          ========================= */}

          {filteredApplicants.length === 0 ? (

            <div className="bg-white rounded-xl shadow-md p-10 text-center">

              <FaSearch
                className="text-gray-300 text-5xl mx-auto mb-4"
              />

              <h2 className="text-xl font-bold text-gray-700">
                No Matching Applicants
              </h2>

              <p className="text-gray-500 mt-2">
                No applicants match your current search or filters.
              </p>

              <button
                onClick={handleResetFilters}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Reset Filters
              </button>

            </div>

          ) : (

            /* =========================
               APPLICANTS TABLE
            ========================= */

            <div className="bg-white rounded-xl shadow-md overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Candidate
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Job
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Applied Date
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredApplicants.map(
                      (applicant) => (

                        <tr
                          key={applicant.id}
                          className="border-t hover:bg-gray-50"
                        >

                          {/* CANDIDATE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <span className="font-semibold text-gray-800">
                                {applicant.candidate_name}
                              </span>

                            </div>

                          </td>

                          {/* EMAIL */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2 text-gray-600">
                              {applicant.candidate_email}
                            </div>

                          </td>

                          {/* JOB */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2 text-gray-600">
                              {applicant.job_title}
                            </div>

                          </td>

                          {/* APPLIED DATE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2 text-gray-600">

                              {new Date(
                                applicant.applied_at
                              ).toLocaleDateString()}

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <select
                                id={`status-${applicant.id}`}
                                name={`status-${applicant.id}`}
                                value={applicant.status}
                                disabled={
                                  updatingId ===
                                  applicant.id
                                }
                                onChange={(e) =>
                                  handleStatusChange(
                                    applicant.id,
                                    e.target.value
                                  )
                                }
                                className={`border rounded-lg px-3 py-2 font-medium outline-none focus:ring-2 focus:ring-blue-500 ${getStatusStyle(
                                  applicant.status
                                )}`}
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

                                <option value="Rejected">
                                  Rejected
                                </option>

                                <option value="Hired">
                                  Hired
                                </option>

                              </select>

                              {updatingId ===
                                applicant.id && (

                                <span className="text-sm text-gray-500">
                                  Updating...
                                </span>

                              )}

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </>

      )}

    </RecruiterLayout>
  );
}