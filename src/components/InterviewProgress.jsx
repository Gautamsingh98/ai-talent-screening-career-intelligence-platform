export default function InterviewProgress({
  currentQuestion,
  totalQuestions,
}) {
  // Prevent invalid values
  const current = Number(currentQuestion) || 0;
  const total = Number(totalQuestions) || 1;

  // Calculate progress percentage
  const progress = Math.min(
    (current / total) * 100,
    100
  );

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">

        <span className="text-sm font-medium text-gray-700">
          Interview Progress
        </span>

        <span className="text-sm font-semibold text-gray-700">
          Question {current} of {total}
        </span>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* Percentage */}
      <div className="text-right mt-1">

        <span className="text-xs text-gray-500">
          {Math.round(progress)}% completed
        </span>

      </div>

    </div>
  );
}