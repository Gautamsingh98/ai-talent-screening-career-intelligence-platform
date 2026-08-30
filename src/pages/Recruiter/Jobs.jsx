import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaPlus,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaTools,
} from "react-icons/fa";

export default function Jobs() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [creating, setCreating] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // =========================
  // FORM STATE
  // =========================

  const [formData, setFormData] = useState({

    title: "",
    description: "",
    required_skills: "",
    experience: "",
    location: "",
    salary: "",

  });


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  // =========================
  // CREATE JOB
  // =========================

  const handleCreateJob = async (e) => {

    e.preventDefault();

    setCreating(true);

    setMessage("");

    setError("");


    try {

      const response = await API.post(
        "/api/recruiter/jobs",
        formData
      );


      setMessage(
        response.data.message
      );


      // Clear form

      setFormData({

        title: "",
        description: "",
        required_skills: "",
        experience: "",
        location: "",
        salary: "",

      });


      setShowForm(false);


      // Refresh jobs

      fetchJobs();


    } catch (err) {

      console.error(
        "Create job error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Failed to create job."
      );


    } finally {

      setCreating(false);

    }

  };


  // =========================
  // FETCH JOBS
  // =========================

  const fetchJobs = async () => {

    try {

      setLoading(true);

      const response = await API.get(
        "/api/recruiter/jobs"
      );


      setJobs(
        response.data.jobs || []
      );


    } catch (err) {

      console.error(
        "Fetch jobs error:",
        err
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
  // PAGE
  // =========================

  return (

    <RecruiterLayout>

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Jobs
          </h1>

          <p className="text-gray-500 mt-2">
            Create and manage your job postings.
          </p>

        </div>


        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >

          <FaPlus />

          {showForm
            ? "Close Form"
            : "Add New Job"}

        </button>

      </div>


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {message && (

        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">

          {message}

        </div>

      )}


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">

          {error}

        </div>

      )}


      {/* =========================
          CREATE JOB FORM
      ========================= */}

      {showForm && (

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create New Job
          </h2>


          <form
            onSubmit={handleCreateJob}
            className="space-y-5"
          >

            {/* Job Title */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Python Developer"
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Description */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Job Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities..."
                rows="5"
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Required Skills */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Required Skills
              </label>

              <input
                type="text"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleChange}
                placeholder="Python, Flask, MySQL, Git"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Experience + Location */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Experience
                </label>

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="1-2 years"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Kathmandu"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>


            {/* Salary */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Salary
              </label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="NPR 40,000 - 60,000"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
            >

              {creating
                ? "Creating Job..."
                : "Create Job"}

            </button>

          </form>

        </div>

      )}


      {/* =========================
          JOB LIST
      ========================= */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Your Job Postings
        </h2>


        {loading ? (

          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <p className="text-gray-500">
              Loading jobs...
            </p>

          </div>

        ) : jobs.length === 0 ? (

          <div className="bg-white rounded-xl shadow-md p-10 text-center">

            <FaBriefcase className="text-gray-300 text-5xl mx-auto mb-4" />

            <h3 className="text-xl font-bold text-gray-700">
              No Jobs Posted Yet
            </h3>

            <p className="text-gray-500 mt-2">
              Click "Add New Job" to create your first job posting.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="bg-white rounded-xl shadow-md p-6"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-xl font-bold text-gray-800">
                      {job.title}
                    </h3>

                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {job.status || "Active"}
                    </span>

                  </div>

                  <FaBriefcase className="text-blue-600 text-2xl" />

                </div>


                <p className="text-gray-600 mt-4">
                  {job.description}
                </p>


                <div className="space-y-3 mt-5">

                  <div className="flex items-center gap-3 text-gray-600">

                    <FaTools />

                    <span>
                      {job.required_skills || "Not specified"}
                    </span>

                  </div>


                  <div className="flex items-center gap-3 text-gray-600">

                    <FaClock />

                    <span>
                      {job.experience || "Not specified"}
                    </span>

                  </div>


                  <div className="flex items-center gap-3 text-gray-600">

                    <FaMapMarkerAlt />

                    <span>
                      {job.location || "Not specified"}
                    </span>

                  </div>


                  <div className="flex items-center gap-3 text-gray-600">

                    <FaMoneyBillWave />

                    <span>
                      {job.salary || "Not specified"}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </RecruiterLayout>

  );
}