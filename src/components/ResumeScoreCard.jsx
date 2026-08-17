export default function ResumeScoreCard({ score = 92 }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Resume Score
      </h2>

      <div className="text-center">

        <h1 className="text-6xl font-bold text-blue-600">
          {score}%
        </h1>

        <p className="text-green-600 font-semibold mt-2">
          Excellent Resume
        </p>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-6">

        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${score}%` }}
        ></div>

      </div>

    </div>
  );
}