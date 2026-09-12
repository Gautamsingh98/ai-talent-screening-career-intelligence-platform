import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaEye,
} from "react-icons/fa";

import API from "../api/axios";

export default function RecentApplicants() {

  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // FETCH RECENT APPLICANTS
  // =========================================================

  useEffect(() => {

    const fetchRecentApplicants = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/recruiter/applicants"
        );

        // Show only latest 5 applicants
        setApplicants(
          (response.data.applicants || []).slice(0, 5)
        );

      } catch (error) {

        console.error(
          "Recent applicants error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load recent applicants."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchRecentApplicants();

  }, []);


  // =========================================================
  // VIEW CANDIDATE
  // =========================================================

  const handleViewCandidate = (applicationId) => {

    navigate(
      `/recruiter/candidates/${applicationId}`
    );

  };


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {

    switch (status) {

      case "Hired":
        return "bg-green-100 text-green-700";

      case "Shortlisted":
        return "bg-blue-100 text-blue-700";

      case "Interview":
        return "bg-yellow-100 text-yellow-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  };


  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Applicants
        </h2>

        <button
          onClick={() =>
            navigate("/recruiter/applicants")
          }
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
          Loading recent applicants...
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
          NO APPLICANTS
      ===================================================== */}

      {!loading &&
       !error &&
       applicants.length === 0 && (

        <div className="py-12 text-center text-gray-500">

          <FaUserCircle
            className="mx-auto text-5xl
                       mb-3 text-gray-300"
          />

          <p>
            No applicants yet.
          </p>

          <button
            onClick={() =>
              navigate("/recruiter/applicants")
            }
            className="mt-4 text-blue-600 hover:underline"
          >
            View Applicants
          </button>

        </div>

      )}


      {/* =====================================================
          APPLICANTS TABLE
      ===================================================== */}

      {!loading &&
       !error &&
       applicants.length > 0 && (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Candidate
                </th>

                <th className="text-center py-3">
                  Applied Role
                </th>

                <th className="text-center py-3">
                  Resume Score
                </th>

                <th className="text-center py-3">
                  Interview Score
                </th>

                <th className="text-center py-3">
                  Status
                </th>

                <th className="text-center py-3">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {applicants.map((applicant) => (

                <tr
                  key={applicant.id}
                  className="border-b hover:bg-gray-50
                             transition duration-200"
                >

                  {/* =================================================
                      CANDIDATE
                  ================================================= */}

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <FaUserCircle
                        className="text-3xl text-blue-600"
                      />

                      <div>

                        <p className="font-medium">
                          {applicant.candidate_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {applicant.candidate_email}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* =================================================
                      ROLE
                  ================================================= */}

                  <td className="text-center">

                    {applicant.job_title || "N/A"}

                  </td>


                  {/* =================================================
                      RESUME SCORE
                  ================================================= */}

                  <td className="text-center">

                    <span className="font-semibold text-green-600">
                      N/A
                    </span>

                  </td>


                  {/* =================================================
                      INTERVIEW SCORE
                  ================================================= */}

                  <td className="text-center">

                    <span className="font-semibold text-blue-600">
                      N/A
                    </span>

                  </td>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full
                                  text-sm font-medium
                                  ${getStatusStyle(
                                    applicant.status
                                  )}`}
                    >
                      {applicant.status || "Applied"}
                    </span>

                  </td>


                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <td className="text-center">

                    <button
                      onClick={() =>
                        handleViewCandidate(
                          applicant.id
                        )
                      }
                      title="View Candidate"
                      className="text-blue-600
                                 hover:text-blue-800
                                 transition"
                    >

                      <FaEye />

                    </button>

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