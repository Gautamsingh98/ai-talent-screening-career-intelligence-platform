import { useEffect, useState } from "react";
import API from "../../api/axios";
import CandidateLayout from "../../layouts/CandidateLayout";

import {
  FaFileAlt,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function ResumeAnalysis() {

  // =========================
  // STATES
  // =========================

  const [analysis, setAnalysis] = useState(null);

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================
  // FETCH ANALYSIS
  // =========================

  useEffect(() => {

    const fetchAnalysis = async () => {

      try {

        setLoading(true);

        setError("");


        const response = await API.get(
          "/api/resume/analyze"
        );


        setAnalysis(
          response.data.analysis
        );


        setResume(
          response.data.resume
        );


      } catch (err) {

        console.error(
          "Resume analysis error:",
          err
        );


        setError(
          err.response?.data?.message ||
          "Failed to analyze resume."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchAnalysis();

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <CandidateLayout>

        <div className="flex items-center justify-center min-h-[500px]">

          <div className="text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
            </div>

            <p className="text-gray-600">
              Analyzing your resume...
            </p>

          </div>

        </div>

      </CandidateLayout>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <CandidateLayout>

        <div className="flex items-center justify-center min-h-[500px]">

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">

            <FaExclamationCircle
              className="text-red-500 text-4xl mx-auto mb-4"
            />

            <h2 className="text-xl font-bold text-red-700 mb-2">
              Resume Analysis Failed
            </h2>

            <p className="text-red-600">
              {error}
            </p>

          </div>

        </div>

      </CandidateLayout>

    );

  }


  // =========================
  // MAIN PAGE
  // =========================

  return (

    <CandidateLayout>

      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Resume Analysis
        </h1>

        <p className="text-gray-500 mt-2">
          Analyze your resume and understand your professional strengths.
        </p>

      </div>


      {/* =========================
          RESUME INFORMATION
      ========================= */}

      {resume && (

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <div className="flex items-center gap-4">

            <FaFileAlt className="text-blue-600 text-4xl" />

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                {resume.filename}
              </h2>

              <p className="text-gray-500 text-sm">
                Uploaded Resume
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          RESUME SCORE
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Resume Score
        </h2>


        <div className="flex flex-col items-center">

          <div className="w-40 h-40 rounded-full border-8 border-blue-600 flex items-center justify-center">

            <div className="text-center">

              <p className="text-4xl font-bold text-blue-600">
                {analysis?.score || 0}
              </p>

              <p className="text-gray-500">
                / 100
              </p>

            </div>

          </div>


          <p className="text-gray-600 mt-5">

            {analysis?.score >= 80
              ? "Excellent Resume"
              : analysis?.score >= 60
              ? "Good Resume"
              : analysis?.score >= 40
              ? "Needs Improvement"
              : "Resume Needs Significant Improvement"}

          </p>

        </div>

      </div>


      {/* =========================
          SKILLS
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">

          <FaTools className="text-blue-600" />

          Skills

        </h2>


        {analysis?.skills?.length > 0 ? (

          <div className="flex flex-wrap gap-3">

            {analysis.skills.map(
              (skill, index) => (

                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                >

                  {skill}

                </span>

              )
            )}

          </div>

        ) : (

          <p className="text-gray-500">
            No skills detected.
          </p>

        )}

      </div>


      {/* =========================
          EDUCATION
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">

          <FaGraduationCap className="text-green-600" />

          Education

        </h2>


        {analysis?.education?.length > 0 ? (

          <div className="space-y-3">

            {analysis.education.map(
              (education, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 border rounded-lg p-4"
                >

                  <FaCheckCircle className="text-green-600 mt-1" />

                  <p className="text-gray-700">
                    {education}
                  </p>

                </div>

              )
            )}

          </div>

        ) : (

          <p className="text-gray-500">
            No education information detected.
          </p>

        )}

      </div>


      {/* =========================
          EXPERIENCE
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">

          <FaBriefcase className="text-purple-600" />

          Experience

        </h2>


        {analysis?.experience?.length > 0 ? (

          <div className="space-y-3">

            {analysis.experience.map(
              (experience, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 border rounded-lg p-4"
                >

                  <FaCheckCircle className="text-purple-600 mt-1" />

                  <p className="text-gray-700">
                    {experience}
                  </p>

                </div>

              )
            )}

          </div>

        ) : (

          <p className="text-gray-500">
            No experience information detected.
          </p>

        )}

      </div>

    </CandidateLayout>

  );
}