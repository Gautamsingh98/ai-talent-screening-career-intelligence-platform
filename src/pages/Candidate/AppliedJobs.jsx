import { useEffect, useState } from "react";
import API from "../../api/axios";
import CandidateLayout from "../../layouts/CandidateLayout";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

export default function AppliedJobs() {

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================
  // FETCH APPLIED JOBS
  // =========================

  const fetchAppliedJobs = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await API.get(
        "/api/candidate/applied-jobs"
      );

      setApplications(
        response.data.applications || []
      );

    } catch (err) {

      console.error(
        "Failed to fetch applied jobs:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load applied jobs."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchAppliedJobs();

  }, []);


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
          Applied Jobs
        </h1>

        <p className="text-gray-500 mt-2">
          Track the jobs you have applied for and check
          your application status.
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
            Loading applied jobs...
          </p>

        </div>

      ) : applications.length === 0 ? (

        /* =========================
           NO APPLICATIONS
        ========================= */

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <FaBriefcase
            className="text-gray-300 text-5xl mx-auto mb-4"
          />

          <h2 className="text-xl font-bold text-gray-700">
            No Applications Yet
          </h2>

          <p className="text-gray-500 mt-2">
            You have not applied for any jobs yet.
          </p>

        </div>

      ) : (

        /* =========================
           APPLICATION CARDS
        ========================= */

        <div className="space-y-6">

          {applications.map((application) => (

            <div
              key={application.id}
              className="bg-white rounded-xl shadow-md p-6"
            >

              {/* =========================
                  HEADER
              ========================= */}

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {application.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Application ID: #{application.id}
                  </p>

                </div>


                {/* STATUS */}

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    application.status === "Applied"
                      ? "bg-blue-100 text-blue-700"
                      : application.status === "Shortlisted"
                      ? "bg-green-100 text-green-700"
                      : application.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >

                  {application.status}

                </span>

              </div>


              {/* =========================
                  DESCRIPTION
              ========================= */}

              <p className="text-gray-600 mt-5">
                {application.description}
              </p>


              {/* =========================
                  JOB DETAILS
              ========================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                <div className="flex items-center gap-3 text-gray-600">

                  <FaBriefcase className="text-blue-500" />

                  <span>
                    {application.required_skills ||
                      "Skills not specified"}
                  </span>

                </div>


                <div className="flex items-center gap-3 text-gray-600">

                  <FaClock className="text-blue-500" />

                  <span>
                    {application.experience ||
                      "Experience not specified"}
                  </span>

                </div>


                <div className="flex items-center gap-3 text-gray-600">

                  <FaMapMarkerAlt className="text-blue-500" />

                  <span>
                    {application.location ||
                      "Location not specified"}
                  </span>

                </div>


                <div className="flex items-center gap-3 text-gray-600">

                  <FaMoneyBillWave className="text-green-600" />

                  <span>
                    {application.salary ||
                      "Salary not specified"}
                  </span>

                </div>

              </div>


              {/* =========================
                  APPLIED DATE
              ========================= */}

              <div className="border-t mt-6 pt-4">

                <div className="flex items-center gap-2 text-gray-500">

                  <FaCheckCircle className="text-green-600" />

                  <span>

                    Applied on{" "}

                    {new Date(
                      application.applied_at
                    ).toLocaleDateString()}

                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </CandidateLayout>

  );
}