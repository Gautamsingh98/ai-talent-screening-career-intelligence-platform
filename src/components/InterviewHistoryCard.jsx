import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function InterviewHistoryCard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/api/interview/history"
      );

      console.log(
        "Interview history response:",
        response.data
      );

      if (response.data.success) {
        setHistory(response.data.history || []);
      } else {
        setError(
          response.data.message ||
            "Failed to load interview history."
        );
      }
    } catch (error) {
      console.error(
        "Interview history error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load interview history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewResult = (interviewId) => {
    navigate(
      `/candidate/interview/result/${interviewId}`
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Interview History
      </h2>

      {loading && (
        <p className="text-gray-500">
          Loading interview history...
        </p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        history.length === 0 && (
          <p className="text-gray-500">
            No interview history available.
          </p>
        )}

      {!loading &&
        !error &&
        history.length > 0 && (
          <div className="space-y-4">

            {history.map((item) => (

              <div
                key={item.interview_id}
                onClick={() =>
                  handleViewResult(
                    item.interview_id
                  )
                }
                className="border rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition"
              >

                <div>

                  <h3 className="font-semibold">
                    {item.job_role}
                  </h3>

                  <p className="text-gray-500">
                    {item.completed_at
                      ? new Date(
                          item.completed_at
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not completed"}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-blue-600 font-bold">
                    {item.score ?? 0}%
                  </span>

                  <span className="text-gray-400 text-sm">
                    View Result →
                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

    </div>
  );
}