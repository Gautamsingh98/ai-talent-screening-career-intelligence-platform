import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CandidateLayout from "../../layouts/CandidateLayout";

import InterviewProgress from "../../components/InterviewProgress";
import QuestionCard from "../../components/QuestionCard";
import AnswerBox from "../../components/AnswerBox";
import API from "../../api/axios";

export default function InterviewQuestion() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // GET INTERVIEW ID
  // =====================================================

  const interviewId =
    localStorage.getItem("interviewId");

  // =====================================================
  // FETCH QUESTION
  // =====================================================

  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!interviewId) {
        setError("Interview session not found.");
        return;
      }

      const response = await API.get(
        `/api/interview/${interviewId}/question`
      );

      console.log(
        "Question response:",
        response.data
      );

      if (response.data.success) {
        setQuestion(response.data.question);

        // Save current question ID
        localStorage.setItem(
          "currentQuestionId",
          response.data.question.id
        );
      }

    } catch (error) {

      console.error(
        "Fetch question error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load interview question."
      );

    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!interviewId) {
      navigate("/candidate/interview");
      return;
    }

    fetchQuestion();

  }, [
    interviewId,
    navigate,
    fetchQuestion
  ]);

  // =====================================================
  // ANSWER SUBMITTED
  // =====================================================

  const handleAnswerSubmitted = async (
    responseData
  ) => {

    console.log(
      "Answer submitted:",
      responseData
    );

    const nextQuestion =
      Number(responseData.next_question);

    const totalQuestions =
      Number(responseData.total_questions);

    // ===================================================
    // MORE QUESTIONS
    // ===================================================

    if (
      nextQuestion &&
      nextQuestion <= totalQuestions
    ) {

      // Fetch next question
      await fetchQuestion();

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // ===================================================
    // ALL QUESTIONS COMPLETED
    // ===================================================

    try {

      setSubmitting(true);

      const response = await API.post(
        `/api/interview/${interviewId}/complete`
      );

      console.log(
        "Complete interview response:",
        response.data
      );

      if (response.data.success) {

        // Mark interview completed
        localStorage.setItem(
          "interviewCompleted",
          "true"
        );

        // Remove current question
        localStorage.removeItem(
          "currentQuestionId"
        );

        // Return to interview page
        navigate("/candidate/interview");
      }

    } catch (error) {

      console.error(
        "Complete interview error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to complete interview."
      );

    } finally {

      setSubmitting(false);

    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <CandidateLayout>

        <div className="bg-white rounded-xl shadow-md p-8">

          <p className="text-gray-500">
            Loading interview question...
          </p>

        </div>

      </CandidateLayout>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <CandidateLayout>

        <div className="bg-white rounded-xl shadow-md p-8">

          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4">
            {error}
          </div>

          <button
            onClick={() =>
              navigate("/candidate/interview")
            }
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Interview
          </button>

        </div>

      </CandidateLayout>
    );
  }

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
          Interview Question
        </h1>

        <p className="text-gray-500 mt-2">
          Answer the question carefully and submit
          your response.
        </p>

      </div>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="mb-8">

        <InterviewProgress
          currentQuestion={
            question?.question_number
          }
          totalQuestions={
            question?.total_questions
          }
        />

      </div>

      {/* =================================================
          QUESTION
      ================================================= */}

      <div className="mb-8">

        <QuestionCard
          question={question}
        />

      </div>

      {/* =================================================
          ANSWER
      ================================================= */}

      <AnswerBox
        questionId={question?.id}
        onAnswerSubmitted={
          handleAnswerSubmitted
        }
        submitting={submitting}
      />

    </CandidateLayout>
  );
}