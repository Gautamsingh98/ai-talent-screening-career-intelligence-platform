import { FaRobot, FaChartLine, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function InterviewProgressCard({
  data = {},
  weakestTopic = {},
  continuePractice = null,
}) {
  const navigate = useNavigate();

  // =========================
  // INTERVIEW DATA
  // =========================

  const completedInterviews =
    data.completed_interviews ?? 0;

  const averageScore =
    data.average_score ?? 0;

  const bestScore =
    data.best_score ?? 0;


  // =========================
  // WEAKEST TOPIC
  // =========================

  const weakestTopicName =
    typeof weakestTopic === "string"
      ? weakestTopic
      : weakestTopic?.topic ||
        weakestTopic?.question_text ||
        "No interview weakness identified";


  // =========================
  // CONTINUE PRACTICE
  // =========================

  const handleContinuePractice = () => {

    if (continuePractice) {

      const interviewId =
        continuePractice.interview_id ||
        continuePractice.id;

      if (interviewId) {

        localStorage.setItem(
          "interviewId",
          interviewId
        );

        navigate(
          "/candidate/interview/question"
        );

        return;
      }
    }

    // If there is no unfinished interview,
    // start from the interview setup page.

    navigate("/candidate/interview");
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      {/* =========================
          HEADING
      ========================= */}

      <div className="flex items-center gap-3 mb-6">

        <h2 className="text-2xl font-bold">
          Practice Interview Progress
        </h2>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        {/* =========================
            COMPLETED INTERVIEWS
        ========================= */}

        <div className="bg-blue-50 rounded-lg p-5 text-center">

          <FaRobot className="text-3xl text-blue-600 mx-auto mb-3" />

          <h3 className="text-lg font-semibold">
            Completed Interviews
          </h3>

          <p className="text-4xl font-bold mt-2 text-blue-700">
            {completedInterviews}
          </p>

        </div>


        {/* =========================
            AVERAGE SCORE
        ========================= */}

        <div className="bg-green-50 rounded-lg p-5 text-center">

          <FaChartLine className="text-3xl text-green-600 mx-auto mb-3" />

          <h3 className="text-lg font-semibold">
            Average Score
          </h3>

          <p className="text-4xl font-bold mt-2 text-green-700">
            {averageScore}%
          </p>

        </div>


        {/* =========================
            BEST SCORE
        ========================= */}

        <div className="bg-yellow-50 rounded-lg p-5 text-center">

          <FaTrophy className="text-3xl text-yellow-500 mx-auto mb-3" />

          <h3 className="text-lg font-semibold">
            Best Score
          </h3>

          <p className="text-4xl font-bold mt-2 text-yellow-600">
            {bestScore}%
          </p>

        </div>

      </div>


      {/* =========================
          WEAKEST TOPIC
      ========================= */}

      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">

        <h3 className="font-semibold text-red-700">
          Weakest Topic
        </h3>

        <p className="mt-2 text-gray-700">
          {weakestTopicName}
        </p>

      </div>


      {/* =========================
          CONTINUE PRACTICE
      ========================= */}

      <div className="mt-8 text-center">

        <button
          onClick={handleContinuePractice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          {continuePractice
            ? "Continue Practice"
            : "Start Practice"}
        </button>

      </div>

    </div>
  );
}