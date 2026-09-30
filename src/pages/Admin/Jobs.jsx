import { useEffect, useState } from "react";
import { FaTrash, FaBriefcase } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

export default function Jobs() {

  // =====================================================
  // STATES
  // =====================================================

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);


  // =====================================================
  // FETCH JOBS FROM BACKEND
  // =====================================================

  const fetchJobs = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // Check authentication token
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
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


      // =================================================
      // READ RESPONSE SAFELY
      // =================================================

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }


      // =================================================
      // HANDLE BACKEND ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          `Failed to fetch jobs. Server returned ${response.status}`
        );

      }


      // =================================================
      // SET JOB DATA
      // =================================================

      setJobs(
        Array.isArray(data.jobs)
          ? data.jobs
          : []
      );

    } catch (error) {

      console.error("Fetch jobs error:", error);

      setError(
        error.message ||
        "Failed to fetch jobs"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDeleteJob = async (jobId) => {

    // ---------------------------------------------------
    // CONFIRM DELETE
    // ---------------------------------------------------

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setDeleting(jobId);
      setError("");


      // -------------------------------------------------
      // GET TOKEN
      // -------------------------------------------------

      const token = localStorage.getItem("token");

      if (!token) {

        throw new Error(
          "Authentication token not found. Please login again."
        );

      }


      // -------------------------------------------------
      // DELETE REQUEST
      // -------------------------------------------------

      const response = await fetch(
        `http://localhost:5000/api/admin/jobs/${jobId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      // -------------------------------------------------
      // READ RESPONSE SAFELY
      // -------------------------------------------------

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }


      // -------------------------------------------------
      // HANDLE DELETE ERROR
      // -------------------------------------------------

      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          `Failed to delete job. Server returned ${response.status}`
        );

      }


      // -------------------------------------------------
      // REMOVE JOB FROM CURRENT UI
      // -------------------------------------------------

      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) => job.id !== jobId
        )
      );


      // Optional success message
      console.log(
        data.message || "Job deleted successfully"
      );


    } catch (error) {

      console.error("Delete job error:", error);

      setError(
        error.message ||
        "Failed to delete job"
      );

    } finally {

      setDeleting(null);

    }
  };


  // =====================================================
  // LOAD JOBS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    fetchJobs();

  }, []);


  // =====================================================
  // PAGE UI
  // =====================================================

  return (

    <AdminLayout>

      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Job Management
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor and manage jobs posted by recruiters.
        </p>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="bg-white rounded-xl shadow-sm p-10 text-center">

          <div className="flex flex-col items-center justify-center gap-3">

            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

            <p className="text-gray-500">
              Loading jobs...
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && !loading && (

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5 mb-6">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="font-semibold">
                Failed to load jobs
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>

            </div>

            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          JOB TABLE
      ================================================= */}

      {!loading && !error && (

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <div className="px-6 py-5 border-b">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">

                <FaBriefcase className="text-blue-600" />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  All Jobs
                </h2>

                <p className="text-sm text-gray-500">
                  {jobs.length} job
                  {jobs.length !== 1 ? "s" : ""} posted
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          {jobs.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Job
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Recruiter
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Salary
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Applications
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>

                </thead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <tbody>

                  {jobs.map((job) => (

                    <tr
                      key={job.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* =================================================
                          JOB
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex items-start gap-3">

                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">

                            <FaBriefcase className="text-blue-600" />

                          </div>

                          <div>

                            <div className="font-semibold text-gray-800">

                              {job.title || "Untitled Job"}

                            </div>

                            <div className="text-sm text-gray-500 mt-1">

                              {job.experience || "Experience not specified"}

                            </div>

                          </div>

                        </div>

                      </td>


                      {/* =================================================
                          RECRUITER
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-gray-800">

                          {job.recruiter_name || "Unknown"}

                        </div>

                        <div className="text-sm text-gray-500">

                          {job.recruiter_email || "No email"}

                        </div>

                      </td>


                      {/* =================================================
                          LOCATION
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-700">

                          {job.location || "Not specified"}

                        </div>

                      </td>


                      {/* =================================================
                          SALARY
                      ================================================= */}

                      <td className="px-6 py-4 text-gray-700">

                        {job.salary || "Not specified"}

                      </td>


                      {/* =================================================
                          APPLICATIONS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-gray-800">

                          {job.applications ?? 0}

                        </span>

                      </td>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >

                          {job.status || "Active"}

                        </span>

                      </td>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            handleDeleteJob(job.id)
                          }
                          disabled={
                            deleting === job.id
                          }
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >

                          <FaTrash />

                          {deleting === job.id
                            ? "Deleting..."
                            : "Delete"
                          }

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            /* =================================================
               NO JOBS
            ================================================= */

            <div className="p-12 text-center">

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">

                <FaBriefcase className="text-gray-400 text-2xl" />

              </div>

              <h3 className="text-lg font-semibold text-gray-700">

                No Jobs Found

              </h3>

              <p className="text-gray-500 mt-2">

                There are currently no jobs posted by recruiters.

              </p>

            </div>

          )}

        </div>

      )}

    </AdminLayout>

  );
}