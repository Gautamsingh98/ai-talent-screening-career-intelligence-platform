import { useState } from "react";
import API from "../api/axios";

export default function AnswerBox({ onAnswerSubmitted }) {
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      // ==========================================
      // VALIDATE ANSWER
      // ==========================================

      if (!answer.trim()) {
        setError(
          "Please enter your answer before submitting."
        );
        return;
      }

      // ==========================================
      // GET CURRENT QUESTION ID
      // ==========================================

      const questionId =
        localStorage.getItem("currentQuestionId");

      if (!questionId) {
        setError("Question ID not found.");
        return;
      }

      // ==========================================
      // SUBMIT ANSWER
      // ==========================================

      setSubmitting(true);
      setError("");
      setResult(null);

      const response = await API.post(
        `/api/interview/question/${questionId}/answer`,
        {
          answer: answer.trim(),
        }
      );

      console.log(
        "Answer response:",
        response.data
      );

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to submit answer."
        );
        return;
      }

      // ==========================================
      // SHOW CURRENT ANSWER EVALUATION
      // ==========================================

      setResult(response.data);

      // Clear textarea
      setAnswer("");

      // ==========================================
      // SEND RESPONSE TO PARENT
      // ==========================================

      if (onAnswerSubmitted) {
        onAnswerSubmitted(response.data);
      }

    } catch (error) {
      console.error(
        "Submit answer error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* ==========================================
          TITLE
      ========================================== */}

      <h2 className="text-2xl font-bold mb-5">
        Your Answer
      </h2>

      {/* ==========================================
          TEXTAREA
      ========================================== */}

      <textarea
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        placeholder="Type your answer here..."
        rows="7"
        disabled={submitting}
        className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="mt-4 bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* ==========================================
          SUBMIT BUTTON
      ========================================== */}

      <div className="flex justify-end mt-5">

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Evaluating..."
            : "Submit Answer"}
        </button>

      </div>

      {/* ==========================================
          ANSWER EVALUATION
      ========================================== */}

      {result && (
        <div className="mt-6 border-t pt-6">

          <h3 className="text-xl font-bold mb-4">
            Answer Evaluation
          </h3>

          <div className="bg-gray-50 rounded-lg p-5">

            {/* SCORE */}

            <p className="text-lg font-semibold mb-3">
              Score:{" "}
              <span className="text-blue-600">
                {result.score}%
              </span>
            </p>

            {/* FEEDBACK */}

            <p className="text-gray-700 mb-5">
              {result.feedback}
            </p>

            {/* ======================================
                STRENGTHS
            ====================================== */}

            {result.strengths &&
              result.strengths.length > 0 && (
                <div className="mb-4">

                  <h4 className="font-semibold text-green-700 mb-2">
                    Strengths
                  </h4>

                  <ul className="list-disc ml-5 space-y-1">

                    {result.strengths.map(
                      (strength, index) => (
                        <li key={index}>
                          {strength}
                        </li>
                      )
                    )}

                  </ul>

                </div>
              )}

            {/* ======================================
                IMPROVEMENTS
            ====================================== */}

            {result.improvements &&
              result.improvements.length > 0 && (
                <div>

                  <h4 className="font-semibold text-orange-600 mb-2">
                    Areas for Improvement
                  </h4>

                  <ul className="list-disc ml-5 space-y-1">

                    {result.improvements.map(
                      (improvement, index) => (
                        <li key={index}>
                          {improvement}
                        </li>
                      )
                    )}

                  </ul>

                </div>
              )}

          </div>

        </div>
      )}

    </div>
  );
}