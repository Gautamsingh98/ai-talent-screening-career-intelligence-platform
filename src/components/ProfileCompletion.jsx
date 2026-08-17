export default function ProfileCompletion() {
  const completion = 85;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Profile Completion
      </h2>

      <div className="flex justify-between mb-2">

        <span className="font-medium">
          Completion
        </span>

        <span className="font-bold text-blue-600">
          {completion}%
        </span>

      </div>

      {/* Progress Bar */}

      <div className="w-full bg-gray-200 rounded-full h-4">

        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${completion}%` }}
        ></div>

      </div>

      <p className="mt-4 text-gray-500">

        Complete your profile to improve job recommendations.

      </p>

    </div>
  );
}