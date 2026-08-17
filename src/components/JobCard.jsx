import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

export default function JobCard({
  title,
  company,
  location,
  salary,
  type,
  skills,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">

      {/* Job Title */}
      <h2 className="text-2xl font-bold text-gray-800">
        {title}
      </h2>

      {/* Company */}
      <p className="text-blue-600 font-semibold mt-1">
        {company}
      </p>

      {/* Job Info */}
      <div className="flex flex-wrap gap-6 mt-4 text-gray-600">

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt />
          {location}
        </div>

        <div className="flex items-center gap-2">
          <FaMoneyBillWave />
          {salary}
        </div>

        <div className="flex items-center gap-2">
          <FaClock />
          {type}
        </div>

      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-5">

        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}

      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">

        <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-semibold">
          View Details
        </button>

        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
          Apply
        </button>

      </div>

    </div>
  );
}