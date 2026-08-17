import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";

export default function RecommendedJobsCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <FaBriefcase className="text-blue-600" />
      Recommended Jobs
      </h2>

      <div className="space-y-5">

        {/* Job 1 */}
        <div className="border rounded-lg p-4">

          <h3 className="font-semibold">
            Data Scientist
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            AI Technologies Pvt. Ltd.
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <FaMapMarkerAlt />
            Kathmandu
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Apply
          </button>

        </div>

        {/* Job 2 */}
        <div className="border rounded-lg p-4">

          <h3 className="font-semibold">
            Python Developer
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Tech Solutions Nepal
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <FaMapMarkerAlt />
            Lalitpur
          </div>

          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            View Job
          </button>

        </div>

      </div>

    </div>
  );
}