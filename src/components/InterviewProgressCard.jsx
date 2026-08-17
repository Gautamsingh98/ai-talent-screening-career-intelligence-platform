import { FaRobot, FaChartLine, FaTrophy } from "react-icons/fa";

export default function InterviewProgressCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <FaRobot className="text-3xl text-blue-600" />
        <h2 className="text-2xl font-bold">
          Practice Interview Progress
        </h2>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Completed Interviews */}
        <div className="bg-blue-50 rounded-lg p-5 text-center">
          <FaRobot className="text-3xl text-blue-600 mx-auto mb-3" />

          <h3 className="text-lg font-semibold">
            Completed Interviews
          </h3>

          <p className="text-4xl font-bold mt-2 text-blue-700">
            8
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-green-50 rounded-lg p-5 text-center">
          <FaChartLine className="text-3xl text-green-600 mx-auto mb-3" />

          <h3 className="text-lg font-semibold">
            Average Score
          </h3>

          <p className="text-4xl font-bold mt-2 text-green-700">
            86%
          </p>
        </div>

        {/* Best Score */}
        <div className="bg-yellow-50 rounded-lg p-5 text-center">
          <FaTrophy className="text-3xl text-yellow-500 mx-auto mb-3" />

          <h3 className="text-lg font-semibold">
            Best Score
          </h3>

          <p className="text-4xl font-bold mt-2 text-yellow-600">
            95%
          </p>
        </div>

      </div>

      {/* Weakest Topic */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">

        <h3 className="font-semibold text-red-700">
          Weakest Topic
        </h3>

        <p className="mt-2 text-gray-700">
          SQL Joins & Database Optimization
        </p>

      </div>

      {/* Button */}
      <div className="mt-8 text-center">

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
          Continue Practice
        </button>

      </div>

    </div>
  );
}