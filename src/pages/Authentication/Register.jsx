import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaRobot,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
} from "react-icons/fa";

import API from "../../api/axios";

export default function Register() {

  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================
  // REGISTER FUNCTION
  // =========================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Check empty fields
    if (!name || !email || !password || !confirmPassword) {

      setError("Please fill in all fields.");

      return;
    }


    // Check password match
    if (password !== confirmPassword) {

      setError("Passwords do not match.");

      return;
    }


    try {

      setLoading(true);


      // Send registration request to Flask
      const response = await API.post(
        "/api/auth/register",
        {
          name: name,
          email: email,
          password: password,
          role: "Candidate",
        }
      );


      // Show success message
      setSuccess(response.data.message);


      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");


      // Redirect to Login after 1.5 seconds
      setTimeout(() => {

        navigate("/");

      }, 1500);


    } catch (err) {

      console.error(err);


      if (err.response) {

        setError(
          err.response.data.message ||
          "Registration failed."
        );

      } else {

        setError(
          "Cannot connect to backend. Make sure Flask is running."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-600 flex items-center justify-center px-4 py-6">

      {/* Register Card */}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-10">


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


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (

          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm text-center">

            {error}

          </div>

        )}


        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {success && (

          <div className="mb-5 bg-green-50 border border-green-200 text-green-600 rounded-lg p-3 text-sm text-center">

            {success}

          </div>

        )}


        {/* =========================
            FORM
        ========================= */}

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
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full p-3 outline-none"
            />

            <FaEye className="text-gray-400 cursor-pointer" />

          </div>


          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-semibold transition duration-300"
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