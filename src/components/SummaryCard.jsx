export default function SummaryCard({
  icon,
  title,
  value,
  progress,
  status,
  color,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">

      {/* Icon */}
      <div className={`text-4xl mb-4 ${color}`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      {/* Value */}
      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Status */}
      <p className="text-sm text-green-600 mt-3">
        {status}
      </p>

    </div>
  );
}