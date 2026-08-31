import { useEffect, useState } from "react";
import API from "../../api/axios";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Applicants() {

  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);


  // =========================
  // FETCH APPLICANTS
  // =========================

  const fetchApplicants = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await API.get(
        "/api/recruiter/applicants"
      );

      setApplicants(
        response.data.applicants || []
      );

    } catch (err) {

      console.error(
        "Failed to fetch applicants:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load applicants."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // LOAD APPLICANTS
  // =========================

  useEffect(() => {

    fetchApplicants();

  }, []);


  // =========================
  // UPDATE APPLICATION STATUS
  // =========================

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {

    try {

      setUpdatingId(applicationId);

      setError("");

      const response = await API.put(
        `/api/recruiter/applicants/${applicationId}/status`,
        {
          status: newStatus,
        }
      );


      // Update status immediately
      setApplicants((currentApplicants) =>
        currentApplicants.map((applicant) =>
          applicant.id === applicationId
            ? {
                ...applicant,
                status: newStatus,
              }
            : applicant
        )
      );


      alert(
        response.data.message ||
        "Application status updated successfully"
      );

    } catch (err) {

      console.error(
        "Failed to update status:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to update application status."
      );

    } finally {

      setUpdatingId(null);

    }

  };


  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {

    switch (status) {

      case "Applied":
        return "bg-blue-100 text-blue-700";

      case "Shortlisted":
        return "bg-green-100 text-green-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Hired":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };


  return (

    <RecruiterLayout>

      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Applicants
        </h1>

        <p className="text-gray-500 mt-2">
          View candidates who have applied for your jobs
          and manage their application status.
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
            Loading applicants...
          </p>

        </div>

      ) : applicants.length === 0 ? (

        /* =========================
           NO APPLICANTS
        ========================= */

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <FaUser
            className="text-gray-300 text-5xl mx-auto mb-4"
          />

          <h2 className="text-xl font-bold text-gray-700">
            No Applicants Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Candidates who apply for your jobs
            will appear here.
          </p>

        </div>

      ) : (

        /* =========================
           APPLICANTS TABLE
        ========================= */

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Candidate
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Job
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Applied Date
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {applicants.map((applicant) => (

                  <tr
                    key={applicant.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* =========================
                        CANDIDATE
                    ========================= */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="bg-blue-100 p-3 rounded-full">

                          <FaUser className="text-blue-600" />

                        </div>

                        <span className="font-semibold text-gray-800">

                          {applicant.candidate_name}

                        </span>

                      </div>

                    </td>


                    {/* =========================
                        EMAIL
                    ========================= */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-gray-600">

                        <FaEnvelope />

                        {applicant.candidate_email}

                      </div>

                    </td>


                    {/* =========================
                        JOB
                    ========================= */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-gray-600">

                        <FaBriefcase />

                        {applicant.job_title}

                      </div>

                    </td>


                    {/* =========================
                        APPLIED DATE
                    ========================= */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-gray-600">

                        <FaCalendarAlt />

                        {new Date(
                          applicant.applied_at
                        ).toLocaleDateString()}

                      </div>

                    </td>


                    {/* =========================
                        STATUS
                    ========================= */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <select
                          id={`status-${applicant.id}`}
                          name={`status-${applicant.id}`}
                          value={applicant.status}
                          disabled={
                            updatingId === applicant.id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              applicant.id,
                              e.target.value
                            )
                          }
                          className={`border rounded-lg px-3 py-2 font-medium outline-none focus:ring-2 focus:ring-blue-500 ${getStatusStyle(
                            applicant.status
                          )}`}
                        >

                          <option value="Applied">
                            Applied
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Interview">
                            Interview
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>

                          <option value="Hired">
                            Hired
                          </option>

                        </select>

                        {updatingId === applicant.id && (

                          <span className="text-sm text-gray-500">
                            Updating...
                          </span>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </RecruiterLayout>

  );

}