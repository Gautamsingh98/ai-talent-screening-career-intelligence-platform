import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import API from "../../api/axios";

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

        const response = await API.get(
          `/api/candidate/jobs/${id}`
        );

        if (response.data.success) {
          setJob(response.data.job);
        } else {
          setError("Job not found");
        }

      } catch (error) {

        console.error("Failed to load job details:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load job details"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchJobDetails();

  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading job details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="bg-white p-8 rounded-xl shadow-sm text-center">

          <p className="text-red-500 mb-5">
            {error}
          </p>

          <button
            onClick={() => navigate("/candidate/jobs")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        {/* Back Button */}

        <button
          onClick={() => navigate("/candidate/jobs")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <FaArrowLeft />
          Back to Jobs
        </button>

        {/* Main Card */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}

          <div className="bg-blue-600 text-white p-8">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaBriefcase className="text-2xl" />
              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  {job.title}
                </h1>

                <p className="text-blue-100 mt-2">
                  Job Opportunity
                </p>

              </div>

            </div>

          </div>

          {/* Job Information */}

          <div className="p-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

              <div className="bg-gray-50 rounded-lg p-5">

                <div className="flex items-center gap-3">

                  <FaMapMarkerAlt className="text-blue-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Location
                    </p>

                    <p className="font-semibold text-gray-800">
                      {job.location || "Not specified"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="bg-gray-50 rounded-lg p-5">

                <div className="flex items-center gap-3">

                  <FaClock className="text-blue-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Experience
                    </p>

                    <p className="font-semibold text-gray-800">
                      {job.experience || "Not specified"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="bg-gray-50 rounded-lg p-5">

                <div className="flex items-center gap-3">

                  <FaMoneyBillWave className="text-green-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Salary
                    </p>

                    <p className="font-semibold text-gray-800">
                      {job.salary || "Not specified"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Description */}

            <div className="mb-8">

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Job Description
              </h2>

              <p className="text-gray-600 leading-7 whitespace-pre-line">
                {job.description || "No description provided."}
              </p>

            </div>

            {/* Required Skills */}

            <div className="mb-8">

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Required Skills
              </h2>

              <div className="bg-gray-50 rounded-lg p-5">

                <p className="text-gray-700 leading-7">
                  {job.required_skills || "No skills specified."}
                </p>

              </div>

            </div>

            {/* Apply Button */}

            <div className="border-t border-gray-200 pt-6 flex justify-end">

              <button
                onClick={() => navigate("/candidate/jobs")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-lg font-medium transition"
              >
                Apply Now
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}