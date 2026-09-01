import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaTrophy,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";

export default function CandidateRanking() {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // FETCH CANDIDATE RANKING
  // =========================

  useEffect(() => {

    const fetchRanking = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await API.get(
          `/api/recruiter/jobs/${jobId}/ranking`
        );

        setJob(response.data.job || null);

        setCandidates(
          response.data.candidates || []
        );

      } catch (err) {

        console.error(
          "Failed to fetch ranking:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to load candidate ranking."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchRanking();

  }, [jobId]);


  // =========================
  // MATCH COLOR
  // =========================

  const getMatchClass = (percentage) => {

    if (percentage >= 80) {
      return "bg-green-100 text-green-700";
    }

    if (percentage >= 60) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };


  return (

    <RecruiterLayout>

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        onClick={() => navigate("/recruiter/jobs")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >

        <FaArrowLeft />

        Back to Jobs

      </button>


      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">

          Candidate Ranking

        </h1>

        {job && (

          <p className="text-gray-500 mt-2">

            Ranking candidates for:

            <span className="font-semibold text-gray-700 ml-1">

              {job.title}

            </span>

          </p>

        )}

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

            Calculating candidate ranking...

          </p>

        </div>

      ) : candidates.length === 0 ? (

        /* =========================
           NO CANDIDATES
        ========================= */

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <FaUser className="text-gray-300 text-5xl mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-700">

            No Candidates Found

          </h2>

          <p className="text-gray-500 mt-2">

            No candidates have applied for this job yet.

          </p>

        </div>

      ) : (

        /* =========================
           CANDIDATE LIST
        ========================= */

        <div className="space-y-5">

          {candidates.map((candidate) => (

            <div
              key={candidate.application_id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >

              {/* =========================
                  HEADER
              ========================= */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div className="flex items-center gap-4">

                  {/* Rank */}

                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                    {candidate.rank === 1 ? (

                      <FaTrophy className="text-yellow-500 text-xl" />

                    ) : (

                      <span className="font-bold text-blue-600">

                        #{candidate.rank}

                      </span>

                    )}

                  </div>


                  {/* Candidate Info */}

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">

                      {candidate.candidate_name}

                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 mt-1">

                      <FaEnvelope />

                      {candidate.candidate_email}

                    </div>

                  </div>

                </div>


                {/* Match Percentage */}

                <div className="text-center">

                  <div
                    className={`inline-block px-5 py-2 rounded-full font-bold text-lg ${getMatchClass(
                      candidate.match_percentage
                    )}`}
                  >

                    {candidate.match_percentage}%

                  </div>

                  <p className="text-sm text-gray-500 mt-1">

                    Skill Match

                  </p>

                </div>

              </div>


              {/* =========================
                  MATCHED SKILLS
              ========================= */}

              <div className="mt-6">

                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">

                  <FaCheckCircle className="text-green-500" />

                  Matched Skills

                </h3>


                <div className="flex flex-wrap gap-2">

                  {candidate.matched_skills?.length > 0 ? (

                    candidate.matched_skills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >

                          {skill}

                        </span>

                      )
                    )

                  ) : (

                    <span className="text-gray-500 text-sm">

                      No matched skills

                    </span>

                  )}

                </div>

              </div>


              {/* =========================
                  MISSING SKILLS
              ========================= */}

              <div className="mt-5">

                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">

                  <FaTimesCircle className="text-red-500" />

                  Missing Skills

                </h3>


                <div className="flex flex-wrap gap-2">

                  {candidate.missing_skills?.length > 0 ? (

                    candidate.missing_skills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                        >

                          {skill}

                        </span>

                      )
                    )

                  ) : (

                    <span className="text-green-600 text-sm">

                      No missing skills

                    </span>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </RecruiterLayout>

  );

}