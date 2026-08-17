export default function SkillMatchCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Overall Skill Match
      </h2>

      <div className="text-center">

        <h1 className="text-6xl font-bold text-blue-600">
          85%
        </h1>

        <p className="text-green-600 font-semibold mt-2">
          Good Match
        </p>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-6">

        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: "85%" }}
        ></div>

      </div>

    </div>
  );
}