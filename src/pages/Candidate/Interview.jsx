import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CandidateLayout from "../../layouts/CandidateLayout";

import InterviewSetupCard from "../../components/InterviewSetupCard";
import InterviewHistoryCard from "../../components/InterviewHistoryCard";
import API from "../../api/axios";

export default function Interview() {
  const navigate = useNavigate();

  // =====================================================
  // INTERVIEW SETUP STATE
  // =====================================================

  const [jobRole, setJobRole] = useState("Data Scientist");
  const [difficulty, setDifficulty] = useState("Beginner");

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // START INTERVIEW
  // =====================================================

  const handleStartInterview = async () => {
    try {
      setStarting(true);
      setError("");

      const response = await API.post(
        "/api/interview/start",
        {
          job_role: jobRole,
          difficulty: difficulty,
        }
      );

      console.log(
        "Start interview response:",
        response.data
      );

      if (response.data.success) {
        const interviewId =
          response.data.interview_id;

        // Save interview ID
        localStorage.setItem(
          "interviewId",
          interviewId
        );

        // Reset completion state
        localStorage.removeItem(
          "interviewCompleted"
        );

        // Navigate to question interface
        navigate(
          "/candidate/interview/question"
        );
      }
    } catch (error) {
      console.error(
        "Start interview error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to start interview."
      );
    } finally {
      setStarting(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <CandidateLayout>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Practice Interview
        </h1>

        <p className="text-gray-500 mt-2">
          Practice AI-powered mock interviews and
          improve your performance.
        </p>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          INTERVIEW SETUP
      ================================================= */}

      <InterviewSetupCard
        jobRole={jobRole}
        difficulty={difficulty}
        setJobRole={setJobRole}
        setDifficulty={setDifficulty}
        onStartInterview={handleStartInterview}
        starting={starting}
      />

      {/* =================================================
          INTERVIEW HISTORY
      ================================================= */}

      <div className="mt-8">

        <InterviewHistoryCard />

      </div>

    </CandidateLayout>
  );
}