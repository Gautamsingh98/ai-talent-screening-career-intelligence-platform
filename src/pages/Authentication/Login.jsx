import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRobot,
} from "react-icons/fa";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Message states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Check fields
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      // Get token and user information
      const { token, user } = response.data;

      // Store JWT token
      localStorage.setItem("token", token);

      // Store user information
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to role
      if (user.role === "Candidate") {
        navigate("/candidate/dashboard");
      } else if (user.role === "Recruiter") {
        navigate("/recruiter/dashboard");
      } else if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid user role.");
      }

    } catch (error) {

      if (error.response) {
        setError(
          error.response.data.message ||
          "Login failed."
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

      {/* Login Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-blue-100">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
            <FaRobot className="text-blue-700 text-4xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-black-700">
          AI Talent Screening
        </h1>

        <h1 className="text-center font-bold text-gray-600 text-lg mt-2">
          & Career Intelligence Platform
        </h1>

        <p className="text-center text-gray-500 text-sm mt-4 mb-8">
          Welcome Back! Please login to your account.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* Email */}
          <label className="block font-semibold text-gray-700 mb-2">
            Email
          </label>

          <div className="flex items-center border rounded-lg px-4 mb-5 focus-within:ring-2 focus-within:ring-blue-500">
            <FaEnvelope className="text-gray-400" />

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 outline-none"
            />
          </div>

          {/* Password */}
          <label className="block font-semibold text-gray-700 mb-2">
            Password
          </label>

          <div className="flex items-center border rounded-lg px-4 focus-within:ring-2 focus-within:ring-blue-500">

            <FaLock className="text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500 cursor-pointer" />
              ) : (
                <FaEye className="text-gray-500 cursor-pointer" />
              )}
            </button>

          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center mt-5 mb-7">

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">

              <input
                type="checkbox"
                className="accent-blue-700"
              />

              Remember Me

            </label>

            <button
              className="text-blue-700 text-sm hover:underline"
              type="button"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full transition duration-300 text-white py-3 rounded-lg font-semibold shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-gray-600 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-700 font-semibold hover:underline"
          >
            Register as Candidate
          </Link>

        </p>

      </div>
    </div>
  );
}