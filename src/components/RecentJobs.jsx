import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaEye,
  FaEdit,
} from "react-icons/fa";

import API from "../api/axios";

export default function RecentJobs() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // FETCH RECENT JOBS
  // =========================================================

  useEffect(() => {

    const fetchRecentJobs = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/recruiter/jobs"
        );

        // Only show the latest 4 jobs
        setJobs(
          (response.data.jobs || []).slice(0, 4)
        );

      } catch (error) {

        console.error(
          "Recent jobs error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load recent jobs."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchRecentJobs();

  }, []);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    const jobDate = new Date(date);

    return jobDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  // =========================================================
  // VIEW JOB
  // =========================================================

  const handleViewJob = (jobId) => {

    navigate(`/recruiter/jobs/${jobId}`);

  };


  // =========================================================
  // EDIT JOB
  // =========================================================

  const handleEditJob = (jobId) => {

    navigate(`/recruiter/jobs?edit=${jobId}`);

  };


  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Jobs
        </h2>

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="bg-blue-600 hover:bg-blue-700
                     text-white px-4 py-2 rounded-lg
                     transition duration-200"
        >
          View All
        </button>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="py-12 text-center text-gray-500">
          Loading recent jobs...
        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (

        <div className="py-12 text-center text-red-500">
          {error}
        </div>

      )}


      {/* =====================================================
          NO JOBS
      ===================================================== */}

      {!loading &&
       !error &&
       jobs.length === 0 && (

        <div className="py-12 text-center text-gray-500">

          <FaBriefcase className="mx-auto text-4xl mb-3 text-gray-300" />

          <p>
            No jobs posted yet.
          </p>

          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Create your first job
          </button>

        </div>

      )}


      {/* =====================================================
          JOB TABLE
      ===================================================== */}

      {!loading &&
       !error &&
       jobs.length > 0 && (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Job Title
                </th>

                <th className="text-center py-3">
                  Applications
                </th>

                <th className="text-center py-3">
                  Status
                </th>

                <th className="text-center py-3">
                  Posted
                </th>

                <th className="text-center py-3">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {jobs.map((job) => (

                <tr
                  key={job.id}
                  className="border-b hover:bg-gray-50
                             transition duration-200"
                >

                  {/* Job Title */}

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <FaBriefcase className="text-blue-600" />

                      <span className="font-medium">
                        {job.title}
                      </span>

                    </div>

                  </td>


                  {/* Applications */}

                  <td className="text-center">

                    <span className="font-medium">
                      {job.applications || 0}
                    </span>

                  </td>


                  {/* Status */}

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full
                                  text-sm font-medium ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status || "Active"}
                    </span>

                  </td>


                  {/* Posted */}

                  <td className="text-center text-gray-600">

                    {formatDate(job.created_at)}

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="flex justify-center gap-4">

                      {/* View */}

                      <button
                        onClick={() =>
                          handleViewJob(job.id)
                        }
                        title="View Job"
                        className="text-blue-600
                                   hover:text-blue-800
                                   transition"
                      >

                        <FaEye />

                      </button>


                      {/* Edit */}

                      <button
                        onClick={() =>
                          handleEditJob(job.id)
                        }
                        title="Edit Job"
                        className="text-green-600
                                   hover:text-green-800
                                   transition"
                      >

                        <FaEdit />

                      </button>

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