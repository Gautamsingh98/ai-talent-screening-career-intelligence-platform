import {
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function AppliedJobCard({
  title,
  company,
  appliedDate,
  status,
  interviewDate,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <div className="flex items-center gap-2 mt-3 text-gray-600">
        <FaBuilding />
        {company}
      </div>

      <div className="flex items-center gap-2 mt-3 text-gray-600">
        <FaCalendarAlt />
        Applied: {appliedDate}
      </div>

      {interviewDate && (
        <div className="flex items-center gap-2 mt-3 text-gray-600">
          <FaCalendarAlt />
          Interview: {interviewDate}
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">

        <FaCheckCircle className="text-green-600" />

        <span className="font-semibold">
          {status}
        </span>

      </div>

      <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
        View Details
      </button>

    </div>
  );
}