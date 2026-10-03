export default function ResumeScoreCard({ score = 0 }) {

  const resumeScore = Number(score) || 0;

  const getAssessment = () => {

    if (resumeScore >= 90) {
      return "Excellent Resume";
    }

    if (resumeScore >= 75) {
      return "Good Resume";
    }

    if (resumeScore >= 60) {
      return "Average Resume";
    }

    return "Needs Improvement";
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Resume Score
      </h2>

      <div className="text-center">

        <h1 className="text-6xl font-bold text-blue-600">
          {resumeScore}%
        </h1>

        <p className="text-green-600 font-semibold mt-2">
          {getAssessment()}
        </p>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-6">

        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(resumeScore, 100)}%`
          }}
        ></div>

      </div>

    </div>
  );
}