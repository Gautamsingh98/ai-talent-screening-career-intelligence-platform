export default function RecruiterReportCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Hiring Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Hiring Trend
        </h2>

        <div className="h-72 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500">

          Line Chart Placeholder

        </div>

      </div>

      {/* Applications by Role */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Applications by Job Role
        </h2>

        <div className="h-72 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500">

          Bar Chart Placeholder

        </div>

      </div>

    </div>
  );
}