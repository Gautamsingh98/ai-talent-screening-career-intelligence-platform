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
  FaSave,
} from "react-icons/fa";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    experience: "",
    location: "",
    salary: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // FETCH JOB
  // =========================================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/api/recruiter/jobs/${id}`
        );

        if (response.data.success && response.data.job) {
          const job = response.data.job;

          setFormData({
            title: job.title || "",
            description: job.description || "",
            required_skills: job.required_skills || "",
            experience: job.experience || "",
            location: job.location || "",
            salary: job.salary || "",
            status: job.status || "Active",
          });
        } else {
          setError(
            response.data.message || "Failed to load job."
          );
        }

      } catch (error) {
        console.error("Failed to fetch job:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // UPDATE JOB
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await API.put(
        `/api/recruiter/jobs/${id}`,
        formData
      );

      if (response.data.success) {
        setSuccess("Job updated successfully.");

        setTimeout(() => {
          navigate(`/recruiter/jobs/${id}`);
        }, 1000);
      } else {
        setError(
          response.data.message || "Failed to update job."
        );
      }

    } catch (error) {
      console.error("Update job error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to update job."
      );
    } finally {
      setSaving(false);
    }
  };

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
  // PAGE
  // =========================================================

  return (
    <div className="p-6">

      {/* Back */}
      <button
        onClick={() => navigate(`/recruiter/jobs/${id}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-4"
      >
        <FaArrowLeft />
        <span className="font-medium">Back</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Job
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Update your posted job information
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-600">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >

        {/* Job Title */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>

          <div className="relative">
            <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job title"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter job description"
          />
        </div>

        {/* Required Skills */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>

          <div className="relative">
            <FaTools className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type="text"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Python, SQL, Machine Learning"
            />
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience
            </label>

            <div className="relative">
              <FaClock className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0-2 years"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>

            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Damak, Nepal"
              />
            </div>
          </div>

        </div>

        {/* Salary + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary
            </label>

            <div className="relative">
              <FaMoneyBillWave className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NPR 50,000–70,000 per month"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Active">
                Active
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">

          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/recruiter/jobs/${id}`)
            }
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}