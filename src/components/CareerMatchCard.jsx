export default function BestCareerMatchCard({ career }) {

  if (!career) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Best Career Match
      </h2>

      <div className="text-center">

        <div className="text-5xl mb-4">
          🏆
        </div>

        <h3 className="text-3xl font-bold text-blue-600">
          {career.career}
        </h3>

        <p className="text-5xl font-bold text-green-600 mt-4">
          {career.match_percentage}%
        </p>

        <p className="text-gray-500 font-semibold mt-2">
          Match
        </p>

      </div>

    </div>
  );
}