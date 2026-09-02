import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import RecruiterLayout from "../../layouts/RecruiterLayout";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa";

export default function CandidateRanking() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [job, setJob] = useState(null);

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================
  // FETCH CANDIDATE RANKING
  // =========================

  const fetchRanking = useCallback(async () => {
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
        "Candidate ranking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load candidate ranking."
      );

    } finally {
      setLoading(false);
    }
  }, [jobId]);

  // =========================
  // LOAD RANKING
  // =========================

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  // =========================
  // PAGE
  // =========================

  return (
    <RecruiterLayout>

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-5"
        >
          <FaArrowLeft />
          Back to Jobs
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Candidate Ranking
        </h1>

        <p className="text-gray-500 mt-2">
          View candidates ranked according to their resume match.
        </p>

      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <p className="text-gray-500">
            Generating candidate ranking...
          </p>

        </div>

      ) : (

        <>

          {/* =========================
              JOB INFORMATION
          ========================= */}

          {job && (

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    {job.title}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Required Skills
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {job.required_skills
                      ?.split(",")
                      .map((skill, index) => (

                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.trim()}
                        </span>

                      ))}

                  </div>

                </div>

                <FaTrophy className="text-yellow-500 text-4xl" />

              </div>

            </div>

          )}

          {/* =========================
              NO CANDIDATES
          ========================= */}

          {candidates.length === 0 ? (

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
                  className="bg-white rounded-xl shadow-md p-6"
                >

                  {/* =========================
                      CANDIDATE HEADER
                  ========================= */}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">

                        <FaUser className="text-blue-600 text-xl" />

                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-gray-800">
                          {candidate.candidate_name}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-500 mt-1">

                          <FaEnvelope />

                          <span>
                            {candidate.candidate_email}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =========================
                        RANK
                    ========================= */}

                    <div className="text-center">

                      <p className="text-sm text-gray-500">
                        Rank
                      </p>

                      <p className="text-3xl font-bold text-purple-600">
                        #{candidate.rank}
                      </p>

                    </div>

                  </div>

                  {/* =========================
                      MATCH SCORE
                  ========================= */}

                  <div className="mt-6">

                    <div className="flex justify-between mb-2">

                      <span className="font-semibold text-gray-700">
                        Resume Match
                      </span>

                      <span className="font-bold text-blue-600">
                        {candidate.match_percentage}%
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">

                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{
                          width: `${candidate.match_percentage}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                  {/* =========================
                      SKILLS
                  ========================= */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* =========================
                        MATCHED SKILLS
                    ========================= */}

                    <div>

                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">

                        <FaCheckCircle className="text-green-600" />

                        Matched Skills

                      </h4>

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

                    <div>

                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">

                        <FaTimesCircle className="text-red-600" />

                        Missing Skills

                      </h4>

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

                  {/* =========================
                      VIEW CANDIDATE BUTTON
                  ========================= */}

                  <div className="mt-6 pt-4 border-t">

                    <button
                      onClick={() =>
                        navigate(
                          `/recruiter/candidates/${candidate.application_id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      View Candidate
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </>

      )}

    </RecruiterLayout>
  );
}