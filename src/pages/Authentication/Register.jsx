import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
} from "react-icons/fa";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Message states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check required fields
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Check password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/register",
        {
          name: name,
          email: email,
          password: password,
          role: "Candidate",
        }
      );

      setSuccess(response.data.message);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Go to login after successful registration
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
          "Registration failed."
        );
      } else {
        setError(
          "Unable to connect to the server. Please make sure Flask is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

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

        {/* Error Message */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <label className="font-semibold text-gray-700">
            Full Name
          </label>

          <div className="mt-2 mb-5 flex items-center border rounded-lg px-4">
            <FaUser className="text-gray-400" />

            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 outline-none"
            />

            <FaEye
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
            />
          </div>

          {/* Confirm Password */}
          <label className="font-semibold text-gray-700">
            Confirm Password
          </label>

          <div className="mt-2 mb-6 flex items-center border rounded-lg px-4">
            <FaLock className="text-gray-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 outline-none"
            />

            <FaEye
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="text-gray-400 cursor-pointer hover:text-gray-600"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Creating Account..."
              : "Create Candidate Account"}
          </button>

        </form>

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