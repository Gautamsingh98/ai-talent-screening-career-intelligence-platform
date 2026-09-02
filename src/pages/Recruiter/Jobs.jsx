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

  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // Job currently being edited
  const [editingJob, setEditingJob] = useState(null);


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
  // RESET FORM
  // =========================

  const resetForm = () => {

    setFormData({

      title: "",
      description: "",
      required_skills: "",
      experience: "",
      location: "",
      salary: "",

    });

    setEditingJob(null);

  };


  // =========================
  // CREATE / UPDATE JOB
  // =========================

  const handleCreateJob = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // ==================================================
    // UPDATE EXISTING JOB
    // ==================================================

    if (editingJob) {

      setUpdating(true);

      try {

        const response = await API.put(
          `/api/recruiter/jobs/${editingJob.id}`,
          formData
        );


        setMessage(
          response.data.message ||
          "Job updated successfully."
        );


        resetForm();

        setShowForm(false);

        fetchJobs();


      } catch (err) {

        console.error(
          "Update job error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to update job."
        );

      } finally {

        setUpdating(false);

      }

      return;
    }


    // ==================================================
    // CREATE NEW JOB
    // ==================================================

    setCreating(true);

    try {

      const response = await API.post(
        "/api/recruiter/jobs",
        formData
      );


      setMessage(
        response.data.message ||
        "Job created successfully."
      );


      resetForm();

      setShowForm(false);

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
  // EDIT JOB
  // =========================

  const handleEditJob = (job) => {

    setMessage("");
    setError("");


    // Store selected job
    setEditingJob(job);


    // Put existing data into form
    setFormData({

      title: job.title || "",

      description:
        job.description || "",

      required_skills:
        job.required_skills || "",

      experience:
        job.experience || "",

      location:
        job.location || "",

      salary:
        job.salary || "",

    });


    // Open form
    setShowForm(true);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {

    resetForm();

    setShowForm(false);

    setMessage("");
    setError("");

  };


  // =========================
  // DELETE JOB
  // =========================

  const handleDeleteJob = async (jobId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );


    if (!confirmDelete) {
      return;
    }


    try {

      setError("");
      setMessage("");


      await API.delete(
        `/api/recruiter/jobs/${jobId}`
      );


      setMessage(
        "Job deleted successfully."
      );


      fetchJobs();


    } catch (err) {

      console.error(
        "Delete job error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Failed to delete job."
      );

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

      setError(
        err.response?.data?.message ||
        "Failed to fetch jobs."
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
          onClick={() => {

            if (showForm) {

              resetForm();

            }

            setShowForm(!showForm);

          }}
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
          CREATE / EDIT JOB FORM
      ========================= */}

      {showForm && (

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            {editingJob
              ? "Edit Job"
              : "Create New Job"}

          </h2>


          <form
            onSubmit={handleCreateJob}
            className="space-y-5"
          >

            {/* =========================
                JOB TITLE
            ========================= */}

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


            {/* =========================
                DESCRIPTION
            ========================= */}

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


            {/* =========================
                REQUIRED SKILLS
            ========================= */}

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


            {/* =========================
                EXPERIENCE + LOCATION
            ========================= */}

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


            {/* =========================
                SALARY
            ========================= */}

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


            {/* =========================
                BUTTONS
            ========================= */}

            <div className="flex flex-col md:flex-row gap-3">

              {/* CANCEL EDIT */}

              {editingJob && (

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
                >
                  Cancel Edit
                </button>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={creating || updating}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >

                {editingJob

                  ? (
                    updating
                      ? "Updating Job..."
                      : "Update Job"
                  )

                  : (
                    creating
                      ? "Creating Job..."
                      : "Create Job"
                  )

                }

              </button>

            </div>

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


        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <p className="text-gray-500">
              Loading jobs...
            </p>

          </div>


        ) : jobs.length === 0 ? (

          /* =========================
             NO JOBS
          ========================= */

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

          /* =========================
             JOB CARDS
          ========================= */

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="bg-white rounded-xl shadow-md p-6"
              >

                {/* =========================
                    JOB HEADER
                ========================= */}

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


                {/* =========================
                    DESCRIPTION
                ========================= */}

                <p className="text-gray-600 mt-4">
                  {job.description}
                </p>


                {/* =========================
                    JOB DETAILS
                ========================= */}

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

{/* =========================
    ACTION BUTTONS
========================= */}

<div className="flex flex-col gap-3 mt-6 pt-5 border-t">

  {/* VIEW CANDIDATE RANKING */}

  <button
    onClick={() =>
      navigate(`/recruiter/jobs/${job.id}/ranking`)
    }
    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
  >
    View Candidate Ranking
  </button>


  {/* EDIT + DELETE */}

  <div className="flex gap-3">

    <button
      onClick={() => handleEditJob(job)}
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
    >
      Edit
    </button>


    <button
      onClick={() => handleDeleteJob(job.id)}
      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
    >
      Delete
    </button>

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