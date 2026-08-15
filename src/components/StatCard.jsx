export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">

      {/* Icon */}
      <div className="text-4xl mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      {/* Value */}
      <h1 className="text-3xl font-bold mt-2">
        {value}
      </h1>

      {/* Subtitle */}
      <p className="text-green-600 mt-2 text-sm">
        {subtitle}
      </p>

    </div>
  );
}