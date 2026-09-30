export default function SkillMatchCard({ skillMatch }) {

  const match = skillMatch ?? 0;

  let matchText = "Needs Improvement";

  if (match >= 80) {
    matchText = "Good Match";
  } else if (match >= 60) {
    matchText = "Average Match";
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Overall Skill Match
      </h2>

      <div className="text-center">

        <h1 className="text-6xl font-bold text-blue-600">
          {match}%
        </h1>

        <p className="text-green-600 font-semibold mt-2">
          {matchText}
        </p>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-6">

        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${match}%` }}
        ></div>

      </div>

    </div>
  );
}