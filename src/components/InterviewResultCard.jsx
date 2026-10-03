import { useEffect, useState } from "react";
import API from "../api/axios";

export default function InterviewResultCard({ interviewId }) {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvaluation = async () => {
    try {
      const id =
        interviewId ||
        localStorage.getItem("interviewId");

      if (!id) {
        setError("Interview ID not found.");
        return;
      }

      setLoading(true);
      setError("");

      const response = await API.get(
        `/api/interview/${id}/evaluation`
      );

      console.log(
        "Interview evaluation response:",
        response.data
      );

      if (response.data.success) {
        setEvaluation(response.data);
      } else {
        setError(
          response.data.message ||
            "Failed to load interview evaluation."
        );
      }
    } catch (error) {
      console.error(
        "Evaluation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load interview evaluation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">
          Loading interview results...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!evaluation) {
    return null;
  }

  const interview = evaluation.interview;
  const result = evaluation.evaluation;
  const questions = evaluation.questions || [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Interview Result
        </h2>

        <p className="text-gray-500 mt-1">
          Review your interview performance and answers.
        </p>
      </div>

      {/* Interview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-blue-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Job Role
          </p>

          <p className="text-xl font-bold text-blue-700 mt-1">
            {interview.job_role}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Difficulty
          </p>

          <p className="text-xl font-bold text-purple-700 mt-1">
            {interview.difficulty}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Final Score
          </p>

          <p className="text-3xl font-bold text-green-700 mt-1">
            {interview.final_score}%
          </p>
        </div>

      </div>

      {/* Performance */}
      <div className="mb-8">

        <h3 className="text-xl font-bold mb-3">
          Performance
        </h3>

        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-lg font-semibold text-gray-800">
            {interview.performance}
          </p>
        </div>

      </div>

      {/* Strengths */}
      <div className="mb-8">

        <h3 className="text-xl font-bold mb-3 text-green-700">
          Strengths
        </h3>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">

          {result?.strengths?.length > 0 ? (
            <ul className="list-disc ml-5 space-y-2">

              {result.strengths.map(
                (strength, index) => (
                  <li
                    key={index}
                    className="text-gray-700"
                  >
                    {strength}
                  </li>
                )
              )}

            </ul>
          ) : (
            <p className="text-gray-500">
              No strengths recorded.
            </p>
          )}

        </div>

      </div>

      {/* Areas for Improvement */}
      <div className="mb-10">

        <h3 className="text-xl font-bold mb-3 text-orange-600">
          Areas for Improvement
        </h3>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">

          {result?.improvements?.length > 0 ? (
            <ul className="list-disc ml-5 space-y-2">

              {result.improvements.map(
                (improvement, index) => (
                  <li
                    key={index}
                    className="text-gray-700"
                  >
                    {improvement}
                  </li>
                )
              )}

            </ul>
          ) : (
            <p className="text-gray-500">
              No improvement suggestions available.
            </p>
          )}

        </div>

      </div>

      {/* Question-by-Question Review */}
      <div>

        <h3 className="text-2xl font-bold mb-5">
          Question Review
        </h3>

        <div className="space-y-6">

          {questions.map(
            (question, index) => (

              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6"
              >

                {/* Question */}
                <div className="flex items-start justify-between gap-4 mb-5">

                  <div>

                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Question{" "}
                      {question.question_number}
                    </p>

                    <p className="text-lg font-semibold text-gray-800">
                      {question.question_text}
                    </p>

                  </div>

                  <div className="shrink-0 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">
                    {question.score ?? 0}%
                  </div>

                </div>

                {/* Candidate Answer */}
                <div className="mb-5">

                  <h4 className="font-semibold text-gray-700 mb-2">
                    Your Answer
                  </h4>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

                    <p className="text-gray-700 leading-relaxed">
                      {question.candidate_answer ||
                        "No answer provided."}
                    </p>

                  </div>

                </div>

                {/* Correct Answer */}
                <div className="mb-5">

                  <h4 className="font-semibold text-green-700 mb-2">
                    Correct Answer
                  </h4>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">

                    <p className="text-gray-700 leading-relaxed">
                      {question.correct_answer ||
                        "Correct answer is not available."}
                    </p>

                  </div>

                </div>

                {/* Feedback */}
                <div>

                  <h4 className="font-semibold text-blue-700 mb-2">
                    AI Feedback
                  </h4>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

                    <p className="text-gray-700 leading-relaxed">
                      {question.feedback ||
                        "No feedback available."}
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}