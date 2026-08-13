import { Link } from "react-router-dom";
import {
  FaRobot,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
} from "react-icons/fa";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 flex items-center justify-center px-4">

      {/* Register Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <FaRobot className="text-blue-700 text-4xl" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-blue-700">
          AI Talent Screening
        </h1>

        <p className="text-center text-gray-600 mt-2">
          Career Intelligence Platform
        </p>

        <h2 className="text-xl font-semibold text-center mt-6">
          Create Candidate Account
        </h2>

        <p className="text-center text-gray-500 text-sm mb-8">
          Register to find your dream job opportunities.
        </p>

        {/* Full Name */}
        <label className="font-semibold text-gray-700">
          Full Name
        </label>

        <div className="mt-2 mb-5 flex items-center border rounded-lg px-4">
          <FaUser className="text-gray-400" />

          <input
            type="text"
            placeholder="Enter full name"
            className="w-full p-3 outline-none"
          />
        </div>

        {/* Email */}
        <label className="font-semibold text-gray-700">
          Email
        </label>

        <div className="mt-2 mb-5 flex items-center border rounded-lg px-4">
          <FaEnvelope className="text-gray-400" />

          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 outline-none"
          />
        </div>

        {/* Password */}
        <label className="font-semibold text-gray-700">
          Password
        </label>

        <div className="mt-2 mb-5 flex items-center border rounded-lg px-4">
          <FaLock className="text-gray-400" />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 outline-none"
          />

          <FaEye className="text-gray-400 cursor-pointer" />
        </div>

        {/* Confirm Password */}
        <label className="font-semibold text-gray-700">
          Confirm Password
        </label>

        <div className="mt-2 mb-6 flex items-center border rounded-lg px-4">
          <FaLock className="text-gray-400" />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full p-3 outline-none"
          />

          <FaEye className="text-gray-400 cursor-pointer" />
        </div>

        {/* Register Button */}
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          Create Candidate Account
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Note */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-700 text-sm text-center">
            ✔ Only Candidates can register. Recruiters and Admins are
            created by the Administrator.
          </p>
        </div>

      </div>

    </div>
  );
}