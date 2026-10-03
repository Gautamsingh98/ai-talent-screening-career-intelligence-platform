import { useEffect, useState } from "react";
import API from "../api/axios";

export default function InterviewSetupCard({
  jobRole,
  difficulty,
  setJobRole,
  setDifficulty,
  onStartInterview,
  starting,
}) {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState("");

  // =====================================================
  // FETCH ACTIVE JOBS
  // =====================================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        setJobError("");

        const response = await API.get(
          "/api/interview/jobs"
        );

        console.log(
          "Interview jobs response:",
          response.data
        );

        if (response.data.success) {
          const availableJobs =
            response.data.jobs || [];

          setJobs(availableJobs);

          // Set first job automatically
          if (
            availableJobs.length > 0 &&
            !availableJobs.some(
              (job) => job.title === jobRole
            )
          ) {
            setJobRole(
              availableJobs[0].title
            );
          }
        } else {
          setJobError(
            response.data.message ||
              "Failed to load jobs."
          );
        }
      } catch (error) {
        console.error(
          "Fetch interview jobs error:",
          error
        );

        setJobError(
          error.response?.data?.message ||
            "Failed to load interview jobs."
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [jobRole, setJobRole]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Interview Setup
        </h2>

        <p className="text-gray-500 mt-2">
          Select a job role and difficulty level
          to start your AI-powered interview.
        </p>

      </div>

      {/* =================================================
          JOB ROLE
      ================================================= */}

      <div className="mb-5">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Role
        </label>

        {loadingJobs ? (

          <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-500">
            Loading available jobs...
          </div>

        ) : jobError ? (

          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">
            {jobError}
          </div>

        ) : jobs.length === 0 ? (

          <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg p-3">
            No active jobs are currently available
            for interview practice.
          </div>

        ) : (

          <select
            value={jobRole}
            onChange={(e) =>
              setJobRole(e.target.value)
            }
            disabled={starting}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >

            {jobs.map((job) => (
              <option
                key={job.id}
                value={job.title}
              >
                {job.title}
              </option>
            ))}

          </select>

        )}

      </div>

      {/* =================================================
          DIFFICULTY
      ================================================= */}

      <div className="mb-6">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Difficulty Level
        </label>

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          disabled={starting}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >

          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>

        </select>

      </div>

      {/* =================================================
          START BUTTON
      ================================================= */}

      <button
        onClick={onStartInterview}
        disabled={
          starting ||
          loadingJobs ||
          jobs.length === 0 ||
          !jobRole
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >

        {starting
          ? "Starting Interview..."
          : "Start Interview"}

      </button>

    </div>
  );
}