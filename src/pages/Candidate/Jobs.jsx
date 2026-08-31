import { useEffect, useState } from "react";
import API from "../../api/axios";
import CandidateLayout from "../../layouts/CandidateLayout";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
} from "react-icons/fa";

export default function Jobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [applyingJob, setApplyingJob] = useState(null);


  // =========================
  // FETCH JOBS
  // =========================

  const fetchJobs = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await API.get(
        "/api/candidate/jobs"
      );

      setJobs(
        response.data.jobs || []
      );

    } catch (err) {

      console.error(
        "Failed to fetch jobs:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load jobs."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // LOAD JOBS
  // =========================

  useEffect(() => {

    fetchJobs();

  }, []);


  // =========================
  // APPLY FOR JOB
  // =========================

  const handleApply = async (jobId) => {

    try {

      setApplyingJob(jobId);

      setError("");

      const response = await API.post(
        "/api/candidate/apply",
        {
          job_id: jobId
        }
      );

      alert(
        response.data.message ||
        "Application submitted successfully"
      );

    } catch (err) {

      console.error(
        "Application error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to apply for this job."
      );

    } finally {

      setApplyingJob(null);

    }

  };


  // =========================
  // SEARCH JOBS
  // =========================

  const filteredJobs = jobs.filter((job) => {

    const searchText =
      search.toLowerCase();

    return (

      job.title
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.required_skills
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.location
        ?.toLowerCase()
        .includes(searchText)

    );

  });


  // =========================
  // PAGE
  // =========================

  return (

    <CandidateLayout>

      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Find Jobs
        </h1>

        <p className="text-gray-500 mt-2">
          Explore available jobs and find opportunities
          that match your skills.
        </p>

      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-5 mb-8">

        <div className="flex items-center border rounded-lg px-4">

          <FaSearch className="text-gray-400" />

          <input
            id="job-search"
            name="job-search"
            type="text"
            placeholder="Search by job title, skill or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full p-3 outline-none"
          />

        </div>

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
            Loading jobs...
          </p>

        </div>

      ) : filteredJobs.length === 0 ? (

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <FaBriefcase className="text-gray-300 text-5xl mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-700">
            No Jobs Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search or check back later.
          </p>

        </div>

      ) : (

        /* =========================
           JOB CARDS
        ========================= */

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >

              {/* =========================
                  JOB HEADER
              ========================= */}

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {job.title}
                  </h2>

                  <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {job.status}
                  </span>

                </div>

                <FaBriefcase className="text-blue-600 text-2xl" />

              </div>


              {/* =========================
                  DESCRIPTION
              ========================= */}

              <p className="text-gray-600 mt-5">
                {job.description}
              </p>


              {/* =========================
                  JOB DETAILS
              ========================= */}

              <div className="space-y-3 mt-5">

                <div className="flex items-center gap-3 text-gray-600">

                  <FaBriefcase className="text-blue-500" />

                  <span>
                    {job.required_skills ||
                      "Skills not specified"}
                  </span>

                </div>


                <div className="flex items-center gap-3 text-gray-600">

                  <FaClock className="text-blue-500" />

                  <span>
                    {job.experience ||
                      "Experience not specified"}
                  </span>

                </div>


                <div className="flex items-center gap-3 text-gray-600">

                  <FaMapMarkerAlt className="text-blue-500" />

                  <span>
                    {job.location ||
                      "Location not specified"}
                  </span>

                </div>


                <div className="flex items-center gap-3 text-gray-600">

                  <FaMoneyBillWave className="text-green-600" />

                  <span>
                    {job.salary ||
                      "Salary not specified"}
                  </span>

                </div>

              </div>


              {/* =========================
                  APPLY BUTTON
              ========================= */}

              <button
                onClick={() =>
                  handleApply(job.id)
                }
                disabled={
                  applyingJob === job.id
                }
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
              >

                {applyingJob === job.id
                  ? "Applying..."
                  : "View & Apply"}

              </button>

            </div>

          ))}

        </div>

      )}

    </CandidateLayout>

  );

}